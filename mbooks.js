const mongoVersion = parseInt(process.env.MONGO_VERSION || "1")

if(mongoVersion != 1) process.exit(0)

const MAX_GAMES = parseInt(process.env.MAX_GAMES || "250")

const { makeSanMovesScala } = require('@easychessanimations/scalachess/lib/outopt.js')

let client

let bookdb

let poscoll

let result

let i = 0

const MongoClient = require('mongodb').MongoClient
 
const MONGODB_URI = process.env.MONGODB_URI
 
const dbName = 'games'

const { streamNdjson } = require('@easychessanimations/fetchutils')

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
		
		bookdb = client.db("book")
		
		poscoll = bookdb.collection("positions")
		
		if(drop) poscoll.drop()
		
		stream()
	}
})

function processGameThen(game){
	return new Promise(resolve => processGame(game, resolve))
}

async function processGame(game, resolve){
	if(game.status == "started"){
		console.log(`skipping game ${game.id} in progress`)
		
		resolve(false)
		
		return
	}
	
	console.log(`processing game ${game.id}`)

	if(game.moves){				
		let moves = game.moves.split(" ")
		if(moves.length > BOOK_DEPTH) moves = moves.slice(0, BOOK_DEPTH)
		
		let [ucis, fens] = makeSanMovesScala(game.variant, game.initialFen, moves)
		
		let variant = game.variant
		
		let gameid = game.id
		
		let score = 0.5
		
		if(game.winner){
			score = game.winner == "white" ? 1 : 0
		}
		
		const botWhite = game.players.white.user.name == BOT_NAME
		
		for(let j = 1; j < ucis.length; j++){
			let san = moves[j-1]
			let uci = ucis[j]
			let fen = fens[j-1]
			let keyparts = fen.split(" ").slice(0, 4)
			let key = keyparts.join(" ")
			
			let turnfen = keyparts[1]
			
			if((botWhite && (turnfen == "b")) || ((!botWhite) && (turnfen == "w"))){
				console.log("skipping opponent move", turnfen, game.players.white.user.name, game.players.black.user.name, san, uci, key)
				continue
			}
			
			let index = i++
			
			console.log(index, san, uci, key)

			result = await poscoll.findOne({
				variant: variant,
				key: key,
				uci: uci
			})

			let doc = {
				variant: variant,
				key: key,
				uci: uci,
				san: san,
				score: score,
				plays: 1,
				gameids: [gameid]
			}

			if(!result){
				console.log("inserting", doc)

				await poscoll.insertOne(doc)
			}else{
				//console.log("result", index, result)	

				if(!result.gameids){
					result.gameids = [gameid]

					console.log("adding gameids")

					poscoll.updateOne({variant: variant, key: key, uci: uci}, {$set: doc}, {upsert: true})
				}else{
					if(result.gameids.includes(gameid)){
						console.log("has gameid")
					}else{
						result.gameids.push(gameid)
						let newScore = (result.score || 0.0) + score
						result.score = newScore
						result.plays++

						console.log("updating score", index, newScore, result.plays)

						poscoll.updateOne({variant: variant, key: key, uci: uci}, {$set: result}, {upsert: true})
					}
				}
			}
		}
	}else{
		console.log(`game ${game.id} has no moves`)
	}
	
	resolve(true)
}

let allgames = []

async function processGames(games){
	for(let game of games){				
		await processGameThen(game)
	}
	
	client.close()
}

let r = 0

function stream(){
	if(drop){		
		return
	}
	
	console.log("streaming")
	
	//poscoll.find({key: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -"}).toArray().then(result => console.log(result)); return
	
	streamNdjson({
		url: `https://lichess.org/api/games/user/${BOT_NAME}?max=${MAX_GAMES}`,
		token: BOT_TOKEN,
		callback: game => {
			console.log(`${r++} of ${MAX_GAMES} adding game ${game.id}`)

			allgames.push(game)
		},
		endcallback:_ => {
			console.log("received games")
			
			processGames(allgames)
			
			//client.close()
		}
	})
}
