const fs = require('fs')

//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript

Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

const PGN_URL = process.env.PGN_URL

const variantName2variantKey = {
	"Standard": "standard",
	"Three-check": "threeCheck",
	"Crazyhouse": "crazyhouse",
	"King of the Hill": "kingOfTheHill",
	"Horde": "horde",
	"Chess960": "chess960",
	"Atomic": "atomic",
	"From Position": "fromPosition",
	"Racing Kings": "racingKings",
	"Antichess" : "antichess"
}

const mongoVersion = parseInt(process.env.MONGO_VERSION || "1")

if(mongoVersion != 2) process.exit(0)

const fetch = require('node-fetch')

const MAX_GAMES = parseInt(process.env.MAX_GAMES || "250")

const { parsePgnFull } = require('@easychessanimations/scalachess/lib/outopt.js')

let client

let bookdb

let movecoll
let gamecoll

let result

let i = 0

const MongoClient = require('mongodb').MongoClient
 
const MONGODB_URI = process.env.MONGODB_URI
 
const BOT_NAME = process.env.BOT_NAME || "chesshyperbot"
const BOT_TOKEN = process.env.TOKEN

const BOOK_DEPTH = parseInt(process.env.BOOK_DEPTH || "40")

const drop = false

function logFunc(...args){
	if(process.env.DISABLE_MONGO2_LOGS == "true") return

	console.log(...args)
}

MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, setClient) {  
	if(err){
		logFunc("MongoDb connection failed.")
	}else{
		logFunc("MongoDb connected.")
		
		client = setClient
		
		bookdb = client.db("book2")
		
		movecoll = bookdb.collection("moves")
		gamecoll = bookdb.collection("games")
		
		if(drop){
			gamecoll.drop()
			movecoll.drop()
			return
		}
		
		loadGames()
	}
})

async function processPgn(pgn, resolve){
	if(!pgn.match(/[^\s]+/)){
		resolve(false)
		
		return
	}
	
	i++
	
	let result = parsePgnFull(pgn)
	
	let tags = result.tags
	
	if(tags.variant){
		let variantKey = variantName2variantKey[tags.variant]
		
		if(!variantKey){
			logFunc(`unknown variant ${tags.variant}`)
			
			resolve(false)
			
			return
		}
		
		tags.variant = variantKey
	}else{
		tags.variant = "standard"
	}
	
	if(PGN_URL){
		tags.hash = pgn.hashCode().toString()
		logFunc(`created hash code ${tags.hash}`)
	}
	
	let stored = await gamecoll.findOne(tags)
	
	let rebuild = true
	
	if(stored){
		if(stored.bookdepth >= BOOK_DEPTH){
			rebuild = false
		}
	}
	
	if(rebuild){
		logFunc(`${i}. processing game ${tags.white} - ${tags.black} ${tags.site}`)	
		
		let ok = true
		
		let effFens = result.fens
		
		if(effFens.length > (BOOK_DEPTH+1)) effFens = effFens.slice(0, BOOK_DEPTH+1)
		
		for(let i =1; i < effFens.length; i++){
			let { uci, san } = effFens[i]
			
			let fen = effFens[i-1].fen
			
			if(uci){
				let parts = fen.split(" ")
				
				if(parts.length >= 4){
					let key = parts.slice(0, 4).join(" ")
					
					let doc = {...tags, ...{
						key: key,
						uci: uci,
						san: san
					}}
					
					let updateResult = await movecoll.updateOne(doc, {$set: doc}, {upsert: true})
					let ok = false
					if((typeof updateResult == "object")&&(typeof updateResult.result == "object")){						
						logFunc(`${san} update n ${updateResult.result.n}`)									
						if(updateResult.result.n != 1){
							logFunc(`move update result n not 1`)
							ok = false
						}
					}else{
						logFunc(`no move update result`)
						ok = false
					}
				}else{
					logFunc(`to few fen fields`)
				}
			}
		}
		
		if(ok){
			let gameDoc = {...tags, ...{
				bookdepth: BOOK_DEPTH
			}}

			logFunc(`updating game ${tags.site}`)
			let updateResult = await gamecoll.updateOne(tags, {$set: gameDoc}, {upsert: true})
			if((typeof updateResult == "object")&&(typeof updateResult.result == "object")){						
				logFunc(`game update n ${updateResult.result.n}`)									
				if(updateResult.result.n != 1){
					logFunc(`game update result n not 1`)
				}
			}else{
				logFunc(`no game update result`)
			}
		}else{
			logFunc(`not updating game ${tags.site}`)
		}
	}else{
		logFunc(`${i}. skipping built game ${tags.white} - ${tags.black} ${tags.site}`)
	}
	
	resolve(true)
}

function processPgnThen(pgn){
	return new Promise(resolve => {
		processPgn(pgn, resolve)
	})
}

async function processPgns(content){
	content = content.replace(/\r/g, "")
	
	let pgns = content.split("\n\n\n")
	
	if(PGN_URL){
		content = content.replace(/\n\n\[/g, "\n\n[[")
		pgns = content.split("\n\n[")
	}
	
	for(let pgn of pgns){
		await processPgnThen(pgn)
	}
	
	logFunc(`processing pgns done`)
	
	client.close()
	
	logFunc(`client closed`)
}

function loadGames(){
	movecoll.countDocuments().then(result=>logFunc("moves", result))
	
	let url = PGN_URL || `https://lichess.org/api/games/user/${BOT_NAME}?max=${MAX_GAMES}`
	
	logFunc(`downloading pgn games from ${url}`)
	
	let headers = {}
	
	if(!PGN_URL) headers.Authorization = `Bearer ${BOT_TOKEN}`

	if(PGN_URL && url.match(/\.7z$/)){
		logFunc(`7zip url detected`)
		
		fetch(url, {
			headers: headers
		}).then(response => {
			const dest = fs.createWriteStream(`temp.7z`)
        	response.body.pipe(dest)
        	response.body.on('end', _ => {
				logFunc(`7z file written to disk`)
				
				const Seven = require('node-7z')
 
				const myStream = Seven.extractFull('temp.7z', '.', { 
					$progress: true
				})
				
				let pgnFile = null
 
				myStream.on('data', function (data) {
					logFunc(data)
					
					if(data.status == "extracted"){
						let file = data.file
						
						if(file.match(/\.pgn$/)){
							pgnFile = file
						}
					}
				})
 
				myStream.on('end', function () {					
					logFunc(`7z file extraced ok ${pgnFile}`)
					
					let content = fs.readFileSync(pgnFile).toString()
					
					processPgns(content)
				})

				myStream.on('error', err => {
					logFunc(`an error occured unzipping 7z file`, err)
					
					client.close()
				})
			})
			dest.on('error', err => {
				logFunc(`an error occured writing 7z file`, err)
			})
		})	
	}else{
		fetch(url, {
			headers: headers
		}).then(response => response.text().then(content => {			
			processPgns(content)
		}))	
	}
}