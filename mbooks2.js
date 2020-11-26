const variantName2variantKey = {
	"Standard": "standard",
	"Three-check": "threeCheck",
	"Crazyhouse": "crazyhouse",
	"King of the Hill": "kingOfTheHill",
	"Horde": "horde",
	"Chess960": "chess960",
	"Atomic": "atomic",
	"From Position": "fromPosition",
	"Racing Kings": "racingKings"
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
 
MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, setClient) {  
	if(err){
		console.log("MongoDb connection failed.")
	}else{
		console.log("MongoDb connected.")
		
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
			console.log(`unknown variant ${tags.variant}`)
			
			resolve(false)
			
			return
		}
		
		tags.variant = variantKey
	}else{
		tags.variant = "standard"
	}
	
	let stored = await gamecoll.findOne(tags)
	
	let rebuild = true
	
	if(stored){
		if(stored.bookdepth >= BOOK_DEPTH){
			rebuild = false
		}
	}
	
	if(rebuild){
		console.log(`${i}. processing game ${tags.white} - ${tags.black} ${tags.site}`)	
		
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
						console.log(`${san} update n ${updateResult.result.n}`)									
						if(updateResult.result.n != 1){
							console.log(`move update result n not 1`)
							ok = false
						}
					}else{
						console.log(`no move update result`)
						ok = false
					}
				}else{
					console.log(`to few fen fields`)
				}
			}
		}
		
		if(ok){
			let gameDoc = {...tags, ...{
				bookdepth: BOOK_DEPTH
			}}

			console.log(`updating game ${tags.site}`)
			let updateResult = await gamecoll.updateOne(tags, {$set: gameDoc}, {upsert: true})
			if((typeof updateResult == "object")&&(typeof updateResult.result == "object")){						
				console.log(`game update n ${updateResult.result.n}`)									
				if(updateResult.result.n != 1){
					console.log(`game update result n not 1`)
				}
			}else{
				console.log(`no game update result`)
			}
		}else{
			console.log(`not updating game ${tags.site}`)
		}
	}else{
		console.log(`${i}. skipping built game ${tags.white} - ${tags.black} ${tags.site}`)
	}
	
	resolve(true)
}

function processPgnThen(pgn){
	return new Promise(resolve => {
		processPgn(pgn, resolve)
	})
}

async function processPgns(content){
	let pgns = content.split("\n\n\n")
		
	for(let pgn of pgns){
		await processPgnThen(pgn)
	}
	
	console.log(`processing pgns done`)
	
	client.close()
	
	console.log(`client closed`)
}

function loadGames(){
	movecoll.countDocuments().then(result=>console.log("moves", result))
	
	fetch(`https://lichess.org/api/games/user/${BOT_NAME}?max=${MAX_GAMES}`, {
		headers: {
			Authorization: `Bearer ${BOT_TOKEN}`
		}
	}).then(response => response.text().then(content => {		
		processPgns(content)
	}))
}