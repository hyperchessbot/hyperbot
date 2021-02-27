////////////////////////////////////////////////////////////////////////////////
// init
const MongoClient = require('mongodb').MongoClient

const MONGODB_URI = process.env.MONGODB_URI

let client, bookdb, poscoll, movecoll

if(MONGODB_URI){
	MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, setClient) {  
		if(err){
			console.log("MongoDb connection failed.")
		}else{
			console.log("MongoDb connected. Version", mongoVersion, ".")

			client = setClient
			
			let coll
			
			if(mongoVersion == 1){
				bookdb = client.db("book")

				poscoll = bookdb.collection("positions")	
				
				coll = poscoll
			}else if(mongoVersion == 2){
				bookdb = client.db("book2")

				movecoll = bookdb.collection("moves")
				
				coll = movecoll
			}
			
			if(coll){
				let index = {
					variant: 1,
					key: 1
				}
				
				console.log(`creating index ${JSON.stringify(index)}`)
				
				coll.createIndex(index).then(result => {
					console.log(`index creation result ${result}`)
				})
			}
		}
	})
}

const fooVersion = '1.0.43'

const lichessBotName = process.env.BOT_NAME || "chesshyperbot"

const { isEnvTrue, formatTime, formatName, SECOND, MINUTE } = require('@easychessanimations/tinyutils')

let envKeys = []

const useStockfish13 = isEnvTrue('USE_STOCKFISH_13')
envKeys.push('USE_STOCKFISH_13')
const disableLogs = isEnvTrue('DISABLE_LOGS')
envKeys.push('DISABLE_LOGS')
const calcFen = (!(isEnvTrue('SKIP_FEN')))
envKeys.push('SKIP_FEN')
const incrementalUpdate = isEnvTrue('INCREMENTAL_UPDATE')
envKeys.push('INCREMENTAL_UPDATE')
const skipAfterFailed = parseInt(process.env.SKIP_AFTER_FAILED || "0")
envKeys.push('SKIP_AFTER_FAILED')
const appName = process.env.APP_NAME || "hyperchessbot"
envKeys.push('APP_NAME')
const generalTimeout = parseInt(process.env.GENERAL_TIMEOUT || "15")
envKeys.push('GENERAL_TIMEOUT')
const engineThreads = process.env.ENGINE_THREADS || "1"
envKeys.push('ENGINE_THREADS')
const engineSkillLevel = process.env.ENGINE_SKILL_LEVEL || "20"
envKeys.push('ENGINE_SKILL_LEVEL')
const engineHash = process.env.ENGINE_HASH || "16"
envKeys.push('ENGINE_HASH')
const engineContempt = process.env.ENGINE_CONTEMPT || "24"
envKeys.push('ENGINE_CONTEMPT')
const engineMoveOverhead = process.env.ENGINE_MOVE_OVERHEAD || "500"
envKeys.push('ENGINE_MOVE_OVERHEAD')
const queryPlayingInterval = parseInt(process.env.QUERY_PLAYING_INTERVAL || "60")
//envKeys.push('QUERY_PLAYING_INTERVAL')
const allowPonder = isEnvTrue('ALLOW_PONDER')
envKeys.push('ALLOW_PONDER')
const useBook = isEnvTrue('USE_BOOK')
envKeys.push('USE_BOOK')
const useMongoBook = isEnvTrue('USE_MONGO_BOOK')
envKeys.push('USE_MONGO_BOOK')
const disableEngineForMongo = isEnvTrue('DISABLE_ENGINE_FOR_MONGO')
envKeys.push('DISABLE_ENGINE_FOR_MONGO')
const mongoVersion = parseInt(process.env.MONGO_VERSION || "1")
envKeys.push('MONGO_VERSION')
const ignoreMongoPercent = parseInt(process.env.IGNORE_MONGO_PERCENT || "20")
envKeys.push('IGNORE_MONGO_PERCENT')
const mongoFilter = parseInt(process.env.MONGO_FILTER || "30")
envKeys.push('MONGO_FILTER')
const bookDepth = parseInt(process.env.BOOK_DEPTH || "20")
envKeys.push('BOOK_DEPTH')
const bookSpread = parseInt(process.env.BOOK_SPREAD || "4")
envKeys.push('BOOK_SPREAD')
const bookRatings = (process.env.BOOK_RATINGS || "2200,2500").split(",")
envKeys.push('BOOK_RATINGS')
const bookSpeeds = (process.env.BOOK_SPEEDS || "blitz,rapid").split(",")
envKeys.push('BOOK_SPEEDS')
const logApi = isEnvTrue('LOG_API')
envKeys.push('LOG_API')
const challengeInterval = parseInt(process.env.CHALLENGE_INTERVAL || "15")
envKeys.push('CHALLENGE_INTERVAL')
const challengeTimeout = parseInt(process.env.CHALLENGE_TIMEOUT || "30")
envKeys.push('CHALLENGE_TIMEOUT')
const urlArray = (name,items) => items.map(item=>`${name}[]=${item}`).join("&")
const useScalachess = isEnvTrue('USE_SCALACHESS')
envKeys.push('USE_SCALACHESS')
const acceptVariants = (process.env.ACCEPT_VARIANTS || "standard").split(" ")
envKeys.push('ACCEPT_VARIANTS')
const acceptSpeeds = (process.env.ACCEPT_SPEEDS || "bullet blitz rapid classical").split(" ")
envKeys.push('ACCEPT_SPEEDS')
const gameStartDelay = parseInt(process.env.GAME_START_DELAY || "2")
envKeys.push('GAME_START_DELAY')
const disableRated = isEnvTrue('DISABLE_RATED')
envKeys.push('DISABLE_RATED')
const disableCasual = isEnvTrue('DISABLE_CASUAL')
envKeys.push('DISABLE_CASUAL')
const disableBot = isEnvTrue('DISABLE_BOT')
envKeys.push('DISABLE_BOT')
const disableHuman = isEnvTrue('DISABLE_HUMAN')
envKeys.push('DISABLE_HUMAN')
const useNNUE = (process.env.USE_NNUE || "standard chess960 fromPosition").split(" ")
envKeys.push('USE_NNUE')
const useLc0 = isEnvTrue('USE_LC0')
envKeys.push('USE_LC0')
const usePolyglot = isEnvTrue('USE_POLYGLOT')
envKeys.push('USE_POLYGLOT')
const useSolution = isEnvTrue('USE_SOLUTION')
envKeys.push('USE_SOLUTION')
const welcomeMessage = process.env.WELCOME_MESSAGE || `coded by @hyperchessbotauthor`
envKeys.push('WELCOME_MESSAGE')
const goodLuckMessage = process.env.GOOD_LUCK_MESSAGE || `Good luck !`
envKeys.push('GOOD_LUCK_MESSAGE')
const goodGameMessage = process.env.GOOD_GAME_MESSAGE || `Good game !`
envKeys.push('GOOD_GAME_MESSAGE')
let disableSyzygy = isEnvTrue('DISABLE_SYZYGY')
envKeys.push('DISABLE_SYZYGY')
const filterThresoldPlays = parseInt(process.env.FILTER_THRESOLD_PLAYS, "10")
envKeys.push('FILTER_THRESOLD_PLAYS')
const bookForgiveness = parseInt(process.env.BOOK_FORGIVENESS, "20")
envKeys.push('BOOK_FORGIVENESS')
const alwaysOn = isEnvTrue('ALWAYS_ON')
envKeys.push('ALWAYS_ON')
const abortAfter = parseInt(process.env.ABORT_AFTER || "120")
envKeys.push('ABORT_AFTER')
const allowCorrespondence = isEnvTrue('ALLOW_CORRESPONDENCE')
envKeys.push('ALLOW_CORRESPONDENCE')
const correspondenceThinkingTime = parseInt(process.env.CORRESPONDENCE_THINKING_TIME || "120")
envKeys.push('CORRESPONDENCE_THINKING_TIME')
const declineHard = isEnvTrue('DECLINE_HARD')
envKeys.push('DECLINE_HARD')
const disableChallengeRandom = isEnvTrue('DISABLE_CHALLENGE_RANDOM')
envKeys.push('DISABLE_CHALLENGE_RANDOM')

const fs = require('fs')

const syzygyPath = "/syzygy"

console.log(`finding syzygy path ${syzygyPath}`)

if(fs.existsSync(syzygyPath)){
	console.log(`syzygy path exists`)
	if(fs.statSync(syzygyPath).isDirectory()){
		console.log(`syzygy path is a directory`)
	}else{
		console.log(`syzygy path is not a directory`)
		disableSyzygy = true
	}
}else{
	console.log(`syzygy path does not exist`)
	disableSyzygy = true
}

if(useLc0){
	console.log(`syzygy is not enabled for Lc0`)
	
	disableSyzygy = true
}

console.log(`syzygy tablebases ${disableSyzygy ? "disabled" : "enabled"}`)

let lastPlayedAt = 0

const { Section, EnvVars } = require('@easychessanimations/foo/lib/smartmd.js')

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const polyglotBookName = "elo-3300.bin"

const Polyglot = require('@easychessanimations/polyglot')

const book = new Polyglot()

if(usePolyglot) book.loadThen(polyglotBookName)

let config = {}

for (let envKey of envKeys){
	let value = process.env[envKey]
	if(value) config[envKey] = value
}

const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const cors = require('cors')

app.use(cors())

const fetch = require('node-fetch')

let docs = null

fetch(`https://raw.githubusercontent.com/hyperbotauthor/hyperbot/docs/docs.json`).then(response=>response.text().then(content=>{
    try{
        docs = JSON.parse(content)        
		
		fs.writeFileSync("README.md",
			`# Welcome to Hyper Bot !\n` +
			docs.sections.map(section=>Section(section)).join("\n") +
			`\n## Config vars\n` +
			EnvVars(docs.envvars)
		)
    }catch(err){console.log(err)}
}))

const lichessUtils = require("@easychessanimations/lichessutils")

const { streamNdjson } = require('@easychessanimations/fetchutils')

const { makeUciMoves } = require("@easychessanimations/scalachess/lib/outopt.js")

const { UciEngine, setLogEngine, AnalyzeJob } = require('@easychessanimations/uci')

const LC0_EXE = (require('os').platform() == "win32") ? "lc0goorm/lc0.exe" : "lc0goorm/lc0"

let stockfishPath = useScalachess ? 'stockfish12m' : 'stockfish12'

if(useStockfish13){	
	stockfishPath = useScalachess ? 'stockfish13m' : 'stockfish13'

	console.log(`using Stockfish 13 ( ${stockfishPath} )`)
}

const enginePath = useLc0 ? LC0_EXE : stockfishPath

const engine = new UciEngine(path.join(__dirname, enginePath))

const corrEngine = allowCorrespondence ? new UciEngine(path.join(__dirname, stockfishPath)) : null

if(useLc0){
	engine.setoption("Weights File", "weights.pb.gz")	
	
	engine.gothen({depth:1}).then(result => console.log(result))
}

const { Chess } = require('chess.js')

let playingGameId = null

const { sseMiddleware, setupStream, ssesend, TICK_INTERVAL } = require('@easychessanimations/sse')

app.use(sseMiddleware)

setupStream(app)

const logStream = isEnvTrue("LOG_FILE") ? fs.createWriteStream("log.txt", {flags: "a"}) : null

let logFileT0 = new Date().getTime()

function logFile(content){
	if(logStream){
		let time = new Date().getTime()
		let elapsed = time - logFileT0
		logFileT0 = time
		logStream.write(`${elapsed} > ${content}\n`)
	}
}

function logPage(content){
	if(disableLogs){
		return
	}

    console.log(content)

    ssesend({
        kind: "logPage",
        content: content
    })
}

setLogEngine(logPage)

const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL
const KEEP_ALIVE_INTERVAL = parseInt(process.env.KEEP_ALIVE_INTERVAL || "5")

const possibleOpeningMoves = ["e2e4", "d2d4", "c2c4", "g1f3", "e2e3"]

const possibleOpeningResponses = {
    "e2e4": ["e7e6", "e7e5", "c7c5", "c7c6", "g8f6", "g7g6", "b7b6", "d7d5"],
    "d2d4": ["e7e6", "e7e5", "c7c5", "c7c6", "g8f6", "d7d5"],
    "c2c4": ["e7e6", "e7e5", "c7c5", "c7c6", "g8f6"],
    "g1f3": ["d7d5", "d7d6", "c7c5", "g8f6"],
    "e2e3": ["e7e5", "d7d6", "c7c5", "g8f6"]
}

// end init
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// bot

function requestBook(state){
    return new Promise(resolve=>{
		if(!state.fen){
			resolve(null)
			
			return
		}
		
		if(useSolution && (state.variant == "antichess")){
			if(state.movesArray.length){
				let url = `http://magma.maths.usyd.edu.au/~watkins/LOSING_CHESS/WEB/browse.php?${state.movesArray.join("+")}`
				
				console.log("getting solution", url)
				
				let timedOut = false				
				
				let solutionTimeout = setTimeout(_=>{					
					console.log("antichess solution timed out")

					timedOut = true

					resolve(null)

					return
				}, 5000)
				
				fetch(url).then(response => response.text().then(content => {					
					clearTimeout(solutionTimeout)
					
					if(timedOut){
						return
					}
					
					let m = content.match(/<tr class="oddRow"><td><a href="browse.php?[^"]+">([^<]+)/)
					if(m){
						let san = m[1]
						console.log("antichess solution move", san)
						
						let result = makeUciMoves("antichess", state.fen, [])		
						
						let legalMovesUcis = result.legalMovesUcis
	
						let uci = null
						
						console.log("legal ucis", legalMovesUcis)
						
						for(let test of legalMovesUcis){
							let result = makeUciMoves("antichess", state.fen, [test])					
						
							let sanMoves = result.sanMoves
							
							//console.log("convert", test, sanMoves[0])
							
							if(sanMoves[0] == san){
								console.log("solution move", test)
								
								resolve({
									source: "solution",
									moves: [{
										white: 1,
										draws: 0,
										black: 0,
										uci: test
									}]
								})
							}
						}
						
						resolve(null)
						
						return
					}else{
						resolve(null)
						
						return
					}
				}))
			}else{
				resolve({
					source: "solution",
					moves: [{
						white: 1,
						draws: 0,
						black: 0,
						uci: "e2e3"
					}]
				})
				
				return
			}
			
			return
		}
		
		if(usePolyglot && lichessUtils.isStandard(state.variant)){
			if(!book.loaded){
				console.log("polyglot book not yet loaded")
				
				resolve(null)
				
				return
			}
			
			let entries = book.find(state.fen)
			
			if((!entries) || (!entries.length)){
				resolve(null)
				
				return
			}
			
			resolve({
				source: "polyglot",
				moves: entries.map(entry => ({
					white: 0,
					draws: entry.weight,
					black: 0,
					uci: entry.algebraic_move
				}))
			})
			
			return
		}
		
		let coll = (mongoVersion == 1) ? poscoll : movecoll
		
		if( useMongoBook && coll ){
			if(!disableEngineForMongo){
				if((Math.random() * 100) < ignoreMongoPercent){
					resolve(null)

					return
				}
			}
			
			let key = state.fen.split(" ").slice(0, 4).join(" ")
			
			getBook(state.variant, key).then(result => {
				if(result.length){
					let moves = result.map(item => ({													
						uci: item.uci,
						plays: item.plays,
						score: Math.floor(item.score * 100)
					}))	
					
					let filteredMoves = moves
					
					if(!disableEngineForMongo){
						filteredMoves = moves.filter(move => {
							let perf = move.score / move.plays

							if(move.plays < filterThresoldPlays) return true

							if((Math.random() * 100) < bookForgiveness) return true

							if(perf < mongoFilter) return false

							return true
						})
					}
					
					if(!filteredMoves.length){
						resolve(null)

						return
					}
					
					let blob = {
						source: "mongo",
						moves: filteredMoves.map(move => ({							
							uci: move.uci,
							white: 0,
							draws: move.score,
							black: 0
						}))
					}
					
					resolve(blob)
					
					return
				}else{
					resolve(null)
				}
			})
			
			return
		}
		
		if(!useBook){
			resolve(null)
			
			return
		}
		
        let reqUrl = `https://explorer.lichess.ovh/lichess?fen=${state.fen}&${urlArray("ratings", bookRatings)}&${urlArray("speeds", bookSpeeds)}&moves=${bookSpread}&variant=${state.variant}`
        
        if(logApi) console.log(reqUrl)

        fetch(reqUrl).then(response=>response.text().then(content=>{
            try{
                let blob = JSON.parse(content)
				
				blob.source = "lichess"

                resolve(blob)
            }catch(err){resolve(null)}
        }))
    })    
}

function getUseBook(moves, failedLookups){
	if(skipAfterFailed){
		if(failedLookups.count >= skipAfterFailed){
			logFile(`skip use book after ${failedLookups.count} failed lookups`)

			return false
		}
	}

	return (useBook || useMongoBook || usePolyglot || useSolution) && (moves.length <= bookDepth)
}

async function makeMove(gameId, state, moves, analyzejob, actualengine, failedLookups){
	logFile(`makeMove ${gameId} ${state} ${moves} ${analyzejob} ${actualengine}`)

    if(state.realtime && playingGameId && (gameId != playingGameId)){
        logPage(`refused to make move for real time game ${gameId} ( already playing real time : ${playingGameId} )`)
		
        return
    }

    logPage(`making move for game ${gameId}, variant ${state.variant}, fen ${state.fen}, moves ${moves}`)

    engine.logProcessLine = false

    let enginePromise

    if(state.variant == "standard"){
        if(moves.length == 0){                    
            let randomOpeningMove = possibleOpeningMoves[Math.floor(Math.random() * possibleOpeningMoves.length)]
            enginePromise = Promise.resolve({
                bestmove: randomOpeningMove,
                source: "own book"
            })
        }

        if(moves.length == 1){                    
            let responses = possibleOpeningResponses[moves[0]]

            if(responses){
                let randomOpeningResponse = responses[Math.floor(Math.random() * responses.length)]
                enginePromise = Promise.resolve({
                    bestmove: randomOpeningResponse,
                    source: "own book"
                })
            }                    
        }
    }    

    let bookalgeb = null
	let bookSource = null

    if(getUseBook(moves, failedLookups)){
        let blob = await requestBook(state)

        if(blob){
            let bmoves = blob.moves

            if(bmoves && bmoves.length){
                let grandTotal = 0

                for(let bmove of bmoves){
                    bmove.total = bmove.white + bmove.draws + bmove.black
                    grandTotal += bmove.total
                }

                let rand = Math.round(Math.random() * grandTotal)

                let currentTotal = 0

                for(let bmove of bmoves){
                    currentTotal += bmove.total                                            
                    if(currentTotal >= rand){
                        bookalgeb = bmove.uci
						bookSource = blob.source
                        break
                    }                                            
                }
            }
        }
    }

    if(bookalgeb){
        logPage(`${bookSource} book move found ${bookalgeb}`)
        enginePromise = Promise.resolve({
            bestmove: bookalgeb,
            source: bookSource + " book"
        })
    }else{
    	failedLookups.count++

    	logFile(`failed lookups ${failedLookups.count}`)
    }

    if(!enginePromise){		
    	logFile(`making engine move`)

		let doPonder = ( ( state.botTime > ( 15 * SECOND ) ) || isEnvTrue("ALLOW_LATE_PONDER") ) && allowPonder
		
		if(isEnvTrue('REDUCE_LATE_TIME')){
			if(state.botTime < ( 30 * SECOND ) ) state.botTime = Math.floor(state.botTime * 0.75)
			if(state.botTime < ( 15 * SECOND ) ) state.botTime = Math.floor(state.botTime * 0.75)	
		}		
		
        logPage(`engine time ${state.botTime} ponder ${doPonder} thinking with ${engineThreads} thread(s) at skill level ${engineSkillLevel} using ${engineHash} hash and overhead ${engineMoveOverhead} with contempt ${engineContempt}`)
		
		analyzejob.position(`fen ${state.initialFen}`, moves)
		
		let timecontrol = state.realtime ? {
			wtime: state.botWhite ? state.botTime : state.wtime, winc: state.winc,
			btime: state.botWhite ? state.btime : state.botTime, binc: state.binc,
			ponderAfter: allowPonder
		}
			:
		{
			wtime: correspondenceThinkingTime * SECOND, winc: 0,
			btime: correspondenceThinkingTime * SECOND, binc: 0
		}
		
		analyzejob.setTimecontrol(timecontrol)
		
		analyzejob.processing = false
		analyzejob.waiting = true
		
        enginePromise = actualengine.enqueueJob(analyzejob)
	}else{
		if(state.realtime) engine.stop()
	}

	logFile(`launching search`)
    
    enginePromise.then(result => {
        let bestmove = result.bestmove
        let ponder = result.ponder

        let score = {unit: "none", value: "none"}

        try{
            scoreTemp = result.depthInfos[result.depthInfos.length - 1].score
            if(scoreTemp) score = scoreTemp
        }catch(err){/*console.log(err)*/}

        let logMsg = `bestmove: ${bestmove}, ponder: ${ponder || "none"}, source: ${result.source || "engine"}, score unit: ${score.unit}, score value: ${score.value}`

        logPage(logMsg)

        logFile(`bestmove ${bestmove} ponder ${ponder} score ${score}`)

        lichessUtils.postApi({
            url: lichessUtils.makeBotMoveUrl(gameId, bestmove), log: logApi, token: process.env.TOKEN,
            callback: content => {
            	logFile(`make move response ${content}`)
                if(logApi) logPage(`move ack: ${content}`)
                if(content.match(/error/)){
					if(state.realtime && playingGameId && (gameId == playingGameId)){
						logPage(`retry move for ${gameId} ${bestmove}`)
					
						engine.spawn() // restart engine for retry move

						setTimeout(_ => makeMove(gameId, state, moves, analyzejob, actualengine, failedLookups), 10 * SECOND)
					}                    
                }
            }
        })
    })
}

function abortGame(gameId){
	console.log(`aborting game ${gameId}`)
	
	lichessUtils.postApi({
		url: lichessUtils.abortGameUrl(gameId), log: logApi, token: process.env.TOKEN,
		callback: content => logPage(`abort game response: ${content}`)
	})
}

function enqueueGame(gameId){
	if(playQueue.find(id => id == gameId)){
		logFile(`game already in queue ${gameId}`)

		return
	}

	playQueue.push(gameId)

	logFile(`enqueued game ${gameId} , queue ${playQueue}`)
}

function playGame(gameId){
	let abortGameTimeout = null

    logPage(`playing game: ${gameId}`)

    let actualengine, analyzejob, speed, correspondence, realtime, botWhite, variant, initialFen, whiteName, blackName, whiteTitle, blackTitle, whiteRating, blackRating, rated, mode
	
	let playgame = true
	
	let playgameTimeout = null
	let duration = null

	let storedChess = null
	let storedMoves = null

	let failedLookups = {
		count: 0
	}

    streamNdjson({url: lichessUtils.streamBotGameUrl(gameId), token: process.env.TOKEN, timeout: generalTimeout, log: logApi, timeoutCallback: _=>{
        logPage(`game ${gameId} timed out ( playing : ${playingGameId} )`)
		
		if( (gameId == playingGameId) || correspondence ){
			playGame(gameId)	
		}                
    }, callback: async function(blob){        
    	logFile(`game event ${JSON.stringify(blob)}`)

		if(!playgame) return
		
		lastPlayedAt = new Date().getTime()
		
        if(blob.type == "gameFull"){                
			speed = blob.speed
			correspondence = ( speed == "correspondence" )
			realtime = !correspondence
			
			if(realtime && playingGameId && ( gameId != playingGameId )){
				playgame = false
				
                logPage(`can't start new game ${gameId}, already playing ${playingGameId}`)
				
				return
            }
			
			if(realtime){
				playingGameId = gameId
				
				setTimeout(_=>lichessUtils.gameChat(gameId, "all", welcomeMessage), 2 * SECOND)
				setTimeout(_=>lichessUtils.gameChat(gameId, "all", goodLuckMessage), 4 * SECOND)
				
				engine.spawn()
				
				engine
				.setoption("Threads", engineThreads)
				.setoption("Skill Level", engineSkillLevel)
				.setoption("Hash", engineHash)
				.setoption("Contempt", engineContempt)
				.setoption("Move Overhead", engineMoveOverhead)	
				
				actualengine = engine
				
				if(blob.clock){		
					const clock = blob.clock
					
					console.log("clock", clock)
					
					const initial = clock.initial || 0
					const increment = clock.increment || 0
					
					duration = initial + lichessUtils.AVERAGE_GAME_LENGTH * increment					
				}else{
					duration = ( 180 * MINUTE ) + ( lichessUtils.AVERAGE_GAME_LENGTH * 180 * SECOND )
				}
				
				console.log("duration", duration)
			}else{
				actualengine = corrEngine
			}
			
			//console.log("actual engine", actualengine)

			abortGameTimeout = setTimeout(_ => {
				console.log(`opponent failed to make their opening move for ${abortAfter} seconds`)

				abortGame(gameId)
			}, abortAfter * SECOND)
			
			whiteName = blob.white.name
			whiteTitle = blob.white.title
			whiteRating = blob.white.rating
			blackName = blob.black.name
			blackTitle = blob.black.title
			blackRating = blob.black.rating
			
            botWhite = whiteName == lichessBotName

            variant = blob.variant.key			
            initialFen = blob.initialFen
			
			rated = blob.rated
			mode = rated ? "rated" : "casual"

            if(initialFen == 'startpos') initialFen = startFen
			
			analyzejob = new AnalyzeJob()
			
			if(!useLc0){
				analyzejob.setoption("UCI_Chess960", variant == "chess960" ? "true" : "false")

				if(useScalachess){
					let uciVariant = ( variant == "threeCheck" ? "3check" : variant.toLowerCase() )
					
					if(lichessUtils.isStandard(variant)) uciVariant = "chess"
					
					analyzejob.setoption("UCI_Variant", uciVariant)				
				}            

				analyzejob.setoption("Use NNUE", useNNUE.includes(variant) ? "true" : "false")

				analyzejob.setoption("SyzygyPath", ( (!disableSyzygy) && lichessUtils.isStandard(variant) ) ? syzygyPath : "<empty>")	
			}
        }

        if(blob.type != "chatLine"){                			
			if(playgameTimeout){
				clearTimeout(playgameTimeout)
			}
			
			playgameTimeout = setTimeout(_ => {
				if(playingGameId && (gameId == playingGameId)){
					console.log("playing game timed out, shutting down", gameId)
					
					playingGameId = null
				}
			}, duration)
			
            let moves = []

            let state = blob.type == "gameFull" ? blob.state : blob

            state.variant = variant
            state.initialFen = initialFen
            state.fen = initialFen
			state.movesArray = []
			state.whiteTitle = whiteTitle
			state.blackTitle = blackTitle			
			state.rated = rated
			state.mode = mode
			state.correspondence = correspondence
			state.realtime = realtime

            if(state.moves){
            	logFile(`setting up fen from moves`)

                moves = state.moves.split(" ")
				state.movesArray = moves

				if(getUseBook(moves, failedLookups) || calcFen){
					if(useScalachess && (state.variant != "standard")){
						let result = makeUciMoves(state.variant, state.initialFen, moves)					
	                    state.fen = result.fen
	                }else{
	                	if(useScalachess) logPage(`switched to chess.js for variant standard`)

	                    let chess = new Chess()
	                	let updateDone = false

	                	if(storedMoves && ( (moves.length - storedMoves.split(" ").length) == 1 ) && incrementalUpdate ){
	                		if(state.moves.substring(0, storedMoves.length) == storedMoves){
	                			chess = storedChess
	                			const lastMove = moves[moves.length - 1]
	                			chess.move(lastMove, {sloppy:true})	                			
	                			updateDone = true

	                			logFile(`updated chess incrementally with move ${lastMove} , stored was ${storedMoves} , update was ${state.moves}`)
	                		}
	                	}

	                	if(!updateDone){
	                		for(let move of moves) chess.move(move, {sloppy:true})
	                	}	                    

	                    state.fen = chess.fen()

	                    storedMoves = state.moves
	                	storedChess = chess
	                }

	                logFile(`setting up fen from moves done`)
				}else{
					logFile(`skipping setting up fen`)
				}
            }
			
			if( abortGameTimeout && ( (botWhite && (state.movesArray.length > 1)) || ((!botWhite) && (state.movesArray.length > 0)) ) ){
				clearTimeout(abortGameTimeout)
				
				abortGameTimeout = null				
			}
			
			state.botWhite = botWhite
			state.botTime = botWhite ? state.wtime : state.btime
			state.orientation = botWhite ? "w" : "b"
			state.title = `${formatName(whiteName, whiteTitle)} ( ${whiteRating} ) ${formatTime(state.wtime)} - ${formatName(blackName, blackTitle)} ( ${blackRating} ) ${formatTime(state.btime)} ${state.variant} ${state.mode}`
			state.lastmove = null
			if(state.movesArray.length) state.lastmove = state.movesArray.slice().pop()
			
			if(realtime && (!disableLogs)) ssesend({
				kind: "refreshGame",
				gameId: gameId,
				fen: state.fen,
				orientation: state.orientation,
				title: state.title,
				lastmove: state.lastmove
			})

            let whiteMoves = (moves.length % 2) == 0
            let botTurn = (whiteMoves && botWhite) || ((!whiteMoves) && (!botWhite))

            if(logApi) logPage(`bot turn: ${botTurn}`)

            if(botTurn){
                try{
                    makeMove(gameId, state, moves, analyzejob, actualengine, failedLookups)
                }catch(err){
					console.log(err)
				}
            }
        }     
    }})
}

function decline(challengeId, reason){
	console.log("ignoring challenge", challengeId, "reason", reason)
	
	if(declineHard){
		console.log("declining challenge", challengeId, "reason", reason)
		lichessUtils.postApi({
			contentType: "application/x-www-form-urlencoded",
			url: lichessUtils.declineChallengeUrl(challengeId), log: this.logApi, token: process.env.TOKEN,
			body: `reason=${reason}`,
			callback: content => console.log(`decline challenge response: ${content}`)
		})
	}
}

function streamEvents(){
    streamNdjson({url: lichessUtils.streamEventsUrl, token: process.env.TOKEN, timeout: generalTimeout, log: logApi, timeoutCallback: _=>{
        logPage(`event stream timed out`)

        streamEvents()
    }, callback: blob => {        
        if(blob.type == "challenge"){
            let challenge = blob.challenge
            let challengeId = challenge.id
			let rated = challenge.rated
			let challenger = challenge.challenger
			let challengerTitle = challenger.title
			let variant = challenge.variant.key
			let speed = challenge.speed
			let correspondence = speed == "correspondence"
			let realtime = !correspondence
			
			let speedok = acceptSpeeds.includes(speed)
			
			if(correspondence && allowCorrespondence) speedok = true

            if( (realtime && playingGameId) || playQueue.length ){
                decline(challengeId, `later`)
            }else if(!acceptVariants.includes(variant)){
                decline(challengeId, `variant`)
            }else if(!speedok){
                decline(challengeId, `timeControl`)
            }else if(rated && disableRated){
                decline(challengeId, `casual`)
            }else if((!rated) && disableCasual){
                decline(challengeId, `rated`)
            }else if((challengerTitle == "BOT") && disableBot){
                decline(challengeId, `noBot`)
            }else if((challengerTitle != "BOT") && disableHuman){
                decline(challengeId, `onlyBot`)
            }else{
                lichessUtils.postApi({
                    url: lichessUtils.acceptChallengeUrl(challengeId), log: logApi, token: process.env.TOKEN,
                    callback: content => logPage(`accept response: ${content}`)
                })
            }
        }

        if(blob.type == "gameStart"){                
            let gameId = blob.game.id
			
            setTimeout(_ => enqueueGame(gameId), gameStartDelay * SECOND)
        }

        if(blob.type == "gameFinish"){                
            let gameId = blob.game.id
			
			logPage(`game ${gameId} terminated ( playing : ${playingGameId} )`)

            if(gameId == playingGameId){                
                playingGameId = null

                engine.stop()
            }
			
			setTimeout(_=>lichessUtils.gameChat(gameId, "all", goodGameMessage), 2 * SECOND)
        }         
    }})
}

function challengeBot(bot){
    return new Promise(resolve=>{
    	if(disableRated && disableCasual){
    		resolve(`both rated and casual modes are disabled, skip challenging bot`)

    		return
    	}

    	let rated = ( Math.random() > 0.5 ) ? "true" : "false"

    	if(disableRated) rated = "false"
    	if(disableCasual) rated = "true"

        lichessUtils.postApi({
            url: lichessUtils.challengeUrl(bot), log: logApi, token: process.env.TOKEN,
            body: `rated=${rated}&clock.limit=${30 * (Math.floor(Math.random() * 4) + 1)}&clock.increment=0`,
            contentType: "application/x-www-form-urlencoded",
            callback: content => {
                logPage(`challenge response: ${content}`)
                resolve(content)
            }
        })
    })    
}

function challengeRandomBot(){
    return new Promise(resolve=>{
    	if(disableChallengeRandom){
    		resolve(`Challenging random bot is disabled.`)

    		return
    	}

        lichessUtils.getOnlineBots().then(bots=>{
            bots = bots.filter(bot=>bot!=lichessBotName)
            if(bots.length > 0){
                let bot = bots[Math.floor(Math.random()*bots.length)]

                logPage(`challenging ${bot}`)

                challengeBot(bot).then(content=>{
                    resolve(`Challenged <b style="color:#070">${bot}</b> with response <i style="color:#007">${content || "none"}</i> .`)
                })
            }
        })
    })    
}

// end bot
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// routes

app.get('/', (req, res) => {
    res.send(`
    <!doctype html>
    <html>
        <head>
            <title>Hyper Bot</title>
            <style>
            .p {
				min-width: 900px;
                max-width: 900px;
                background-color: #eee;
                padding: 6px;
                padding-left: 12px;
                border-style: solid;
                border-width: 1px;
                border-color: #aaa;
                border-radius: 15px;
            }
            body {
                padding-left: 20px;
            }
            </style>
            <script src="https://unpkg.com/@easychessanimations/sse@1.0.6/lib/sseclient.js"></script>
        </head>
        <body>
			<script>
				function challengeRandom(ev){
					ev.preventDefault()
					document.getElementById("logBestmove").innerHTML = \`
					<iframe height="200" width="800" src="/chr"></iframe>
					\`
				}
				function showGameFunc(id, fen, orientation, title, lastmove){
					document.getElementById("showGame").innerHTML = \`
					<!--<iframe height="400" width="800" src="https://lichess.org/embed/\${id}?theme=maple2&bg=auto&rnd=\${Math.random()}"></iframe>-->
					<iframe id="boardframe" style="display: none;" onload="setTimeout(_=>document.getElementById('boardframe').style.display='inline-block', 250);" height="400" width="800" src="/board?fen=\${fen}&orientation=\${orientation}&title=\${title}&lastmove=\${lastmove}&gameId=\${id}"></iframe>
					\`
				}
				var showGameTimeout = null
				function showGame(id, fen, orientation, title, lastmove){
					if(showGameTimeout) clearTimeout(showGameTimeout)
					showGameTimeout = setTimeout(_=>showGameFunc(id, fen, orientation, title, lastmove), 1000)
				}
				function refreshGame(id, fen, orientation, title, lastmove){
					showGame(id, fen, orientation, title, lastmove)
				}
			</script>
            <h1>Welcome to Hyper Bot !</h1>            
            <p class="p"><a href="https://lichess.org/@/${lichessBotName}" rel="noopener noreferrer" target="_blank">${lichessBotName}</a> is powered by Hyper Bot 
            ( 
			<a href="/chr" rel="noopener noreferrer" target="_blank" onclick="challengeRandom(event)">challenge random bot by ${lichessBotName}</a> |
            <a href="/docs" rel="noopener noreferrer" target="_blank">view docs</a> | 
			<a href="/config" rel="noopener noreferrer" target="_blank">view config</a> |
			<a href="https://scalachess.netlify.app/?app=${appName}" rel="noopener noreferrer" target="_blank">view book</a> |
			<a href="/mongostats" rel="noopener noreferrer" target="_blank">mongostats</a>
			)
            </p>
			<p class="p">
To upgrade an account, that has played no games yet, to bot, and to make this bot accept challenges and play games in your browser, visit <a href="https://hypereasy.herokuapp.com" rel="noopener noreferrer" target="_blank">Hyper Easy</a> . 

For detailed instructions see <a href="https://lichess.org/forum/off-topic-discussion/hyper-easy-all-variants-lichess-bot-running-in-your-browser#1" rel="noopener noreferrer" target="_blank">this forum post</a> .
			</p>
            <p class="p" id="logBestmove" style="font-family: monospace;">feedback on random challenges and bot moves will be shown here ...</p>            
			<div class="p" id="showGame" style="height:410px;font-family:monospace;text-align:center;">board of ongoing game will be shown here ...
			<p style="font-family: Arial; font-size: 18px; color: #770;">
Suggestion: To improve your bot performance, your Heroku server should be located in Europe. This can only be changed when creating an app, so if your server is not located in Europe, you have to create a new app and copy all config settings from your old app. It is recommended that you keep the old app, but turn off the old app's web dyno in the Resources tab and disconnect it from GitHub in the Deploy tab.
			</p>
			<p style="font-family: Arial; font-size: 18px; color: #700;">
Warning: Playing while the bot home page is open introduces increased work load on the server. If in addition you use too high values for ENGINE_HASH ( recommended <= 128 ) and ENGINE_THREADS ( recommended <= 4 ), then Heroku rate limits may set in and temporarily disable the server, which will prevent the bot from making moves. If your priority is high rating or your bot is playing in a bot tournament, then close the bot homepage while playing. If your bot fails to move look at the Heroku logs ( More -> View logs ), and if you get memory quota exceeded error, then decrease ENGINE_THREADS and ENGINE_HASH. When the bot is hopelessly stuck, restart the app ( More -> Restart all dynos ).
			</p>			
			</div>
            <script>            
            function processSource(blob){
                if(blob.kind == "tick"){                    
                    if(isFirstSourceTick) console.log("stream started ticking")
                }

				if(blob.kind == "showGame"){
					showGame(blob.gameId, blob.fen, blob.orientation, blob.title, blob.lastmove)
				}

				if(blob.kind == "refreshGame"){
					refreshGame(blob.gameId, blob.fen, blob.orientation, blob.title, blob.lastmove)
				}

                if(blob.kind == "logPage"){
                    let content = blob.content

                    console.log(content)

                    if(content.match(/^bestmove/)){
						let m = content.match(/score value: (.*)/)
						let scoreValue = parseInt(m[1])						
						let color = scoreValue >= 0 ? "#070" : "#700"
						let scoreUnit = content.match(/score unit: ([^,]+)/)[1]
						if(scoreUnit == "cp") scoreValue = scoreValue
						content = content.replace(m[0], \`score value: <span style="font-size: 20px;color: \${color};font-weight: bold;">\${scoreUnit == "mate" ? "#":""}\${scoreValue}</span>\`)
						document.getElementById("logBestmove").innerHTML = content
					}
                }
            }

            setupSource(processSource, ${TICK_INTERVAL})    
            </script>
        </body>
    </html>
    `)  
})

app.get('/chr', (req, res) => {
	if(disableChallengeRandom){
		res.send(`<div style="text-align:center;"><b>Challenging random bot is disabled.</b><hr>To enable this feature, set DISABLE_RANDOM_CHALLENGE config/env var to 'false' or delete it entirely.</div>`)
	}else{
		challengeRandomBot().then(result => res.send(result))
	}
})

app.get('/logfile', (req, res) => {
	if(logStream){
		let lines = fs.readFileSync("log.txt").toString().split("\n").reverse()

		if(lines.length > 10000){
			lines = lines.slice(0, 10000)
		}

		res.send(lines.join(`<br>\n`))
	}else{
		res.send(`log file disabled`)
	}
})

app.get('/docs', (req, res) => {
    if(!docs){
        res.send(`page not ready, try again a little later`)
        return
    }
    
    res.send(`
    <div id="root"></div>
    <script src="https://unpkg.com/@easychessanimations/foo@${fooVersion}/lib/fooweb.js"></script>	
    <script>
		let docs = JSON.parse(\`${JSON.stringify(docs, null, 2)}\`)	
		let app = div().a(
			docs.sections.map(section=>Section({docs: section})),
			Section({docs:{title: "Config vars", paragraphs:[]}}),
			div().addStyle("marginLeft","30px").a(EnvVars({docs: docs.envvars}).addStyle("marginTop", "15px"))
		)
		document.getElementById("root").appendChild(app.e)
    </script>
    `)
})

app.get('/config', (req, res) => {    
    res.send(`
    <div id="root"></div>
    <script src="https://unpkg.com/@easychessanimations/foo@${fooVersion}/lib/fooweb.js"></script>	
    <script>
		let config = JSON.parse(\`${JSON.stringify(config, null, 2)}\`)			
		let app = EnvVars({docs:config})
		document.getElementById("root").appendChild(app.e)
    </script>
    `)
})

app.get('/board', (req, res) => {
    res.send(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Chessboard</title>
		<link href="https://unpkg.com/@easychessanimations/showchessboard/lib/chessboard.css" rel="stylesheet">
		<script src="https://unpkg.com/@easychessanimations/showchessboard/lib/chessboard.js"></script>
	</head>
	<body>
		<div style="width:100%;text-align:center;font-weight:bold;font-family:monospace;">${req.query.title || "? - ?"} 
		<a href="https://lichess.org/${req.query.gameId}" rel="noopener noreferrer" target="blank">open</a>
		</div>
		<div id="board" style="margin-top: 5px;"></div>

		<script>
			let board = new window.ChessBoard('board', {
				size: ${parseInt(req.query.size || "45")},
				fen: "${(req.query.fen || startFen).split(" ")[0]}",
				orientation: "${req.query.orientation || "w"}"
			})			
			let lastmove = "${req.query.lastmove || ""}"
			if(lastmove){
				let from = lastmove.substring(0,2)
				let to = lastmove.substring(2,4)				
				if(!lastmove.match(/@/)) board.selectSquare(from)
				board.selectSquare(to)
			}
		</script>
	</body>
	</html>
	`)
})

app.get('/mongostats', (req, res) => {
	const verMsg =`<div style="font-family: monospace; font-size: 16;">your mongo version is <b>${mongoVersion}</b><hr>`
	if(poscoll){
		poscoll.countDocuments().then(result => {
			res.send(`${verMsg}number of documents in your position collection is <b>${result}</b><script>setTimeout(_ => document.location.reload(), 5000)</script>`)
		})
	}else if(movecoll){
		movecoll.countDocuments().then(result => {
			res.send(`${verMsg}number of moves in your move collection is <b>${result}</b><script>setTimeout(_ => document.location.reload(), 5000)</script>`)
		})
	}else{
		res.send(`your database is not connected`)
	}
})

function getBook(variant, key){
	if(mongoVersion == 1) return getBook1(variant, key)	
	if(mongoVersion == 2) return getBook2(variant, key)
}

function getBook1(variant, key){
	return poscoll.find({variant: variant, key: key}).toArray()
}

function getBook2(variant, key){
	return new Promise(resolve => {
		movecoll.find({variant: variant, key: key}).project({
			uci: 1,
			san: 1,
			result: 1,
			site: 1
		}).toArray().then(resultRaw => {												
			let resultMove = {}

			let result = []

			for(let item of resultRaw){				
				let uci = item.uci
				let san = item.san				
				let gameResult = item.result

				let score = 0.5

				if(gameResult == "1-0") score = 1
				if(gameResult == "0-1") score = 0

				let keyparts = key.split(" ")

				let turn = keyparts[1]

				if(turn == "b") score = 1 - score
				
				let site = item.site
				
				let gameid = undefined
				
				if(site){
					let m = site.match(/\/([^\/]+)$/)
					
					if(m){
						gameid = m[1]
					}
				}

				if(resultMove[uci]){
					resultMove[uci].score += score
					resultMove[uci].plays++
				}else{
					resultMove[uci] = {
						"_id": "aggregated",
						variant: variant,
						key: key,
						uci: uci,
						san: san,												
						score: score,
						plays: 1,
						gameids: []
					}
				}
				
				if(gameid){
					resultMove[uci].gameids.push(gameid)
				}
			}

			for(let uci in resultMove){
				result.push(resultMove[uci])
			}
			
			resolve(result)
		})
	})														 		
}

app.get('/book', (req, res) => {
	let accept = req.headers.accept || req.headers.Accept
	
	const json = ( accept == "application/json" )
	
	if((mongoVersion == 1)&&(!poscoll)){
		res.send(json ? JSON.stringify({
			error: true,
			status: "no database ( version 1 )"
		}) : "error: no database ( version 1 )")
		
		return
	}
	
	if((mongoVersion == 2)&&(!movecoll)){
		res.send(json ? JSON.stringify({
			error: true,
			status: "no database ( version 2 )"
		}) : "error: no database ( version 2 )")
		
		return
	}
	
	const variant = req.query.variant || "standard"
	const fen = req.query.fen || startFen
	const includeGameIds = req.query.includeGameIds == "true"
	
	const key = fen.split(" ").slice(0, 4).join(" ")
	
	getBook(variant, key).then(result => {
		if(!includeGameIds){
			result = result.map(item => {
				delete item["gameids"]
				return item
			})
		}

		if(json){
			res.set("Content-Type", "application/json")

			res.send(JSON.stringify(result))	
		}else{
			res.set("Content-Type", "text/html")

			res.send("<pre>" + JSON.stringify(result, null, 2) + "</pre>")	
		}
	})
})

app.use('/', express.static(__dirname))

// end routes
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// launch

const playQueue = []

let lastPlayGame = null

const playGameDelay = parseInt(process.env.PLAY_GAME_DELAY || "5000")

function watchPlayQueue(){
	if(playQueue.length){
		const now = new Date().getTime()

		if(lastPlayGame){
			const elapsed = now - lastPlayGame

			if(elapsed < playGameDelay){
				return
			}
		}

		lastPlayGame = now

		const gameId = playQueue.shift()

		logFile(`dequeued game ${gameId} , queue ${playQueue}`)

		playGame(gameId)
	}
}

app.listen(port, _ => {
    console.log(`Hyperbot listening on port ${port} !`)

    if(disableLogs){
    	console.log(`logs disabled`)
    }

    if(KEEP_ALIVE_URL){
        console.log(`keep alive interval: ${KEEP_ALIVE_INTERVAL} , url: ${KEEP_ALIVE_URL}`)

        setInterval(_=>{
            let hours = new Date().getHours()
            if( ( (hours > 5) && (hours < 23) ) || alwaysOn ){
                console.log(`hours ok: ${hours}, keep alive`)
                fetch(KEEP_ALIVE_URL)
            }        
        }, KEEP_ALIVE_INTERVAL * MINUTE)
    }

    setInterval(watchPlayQueue, 200)

    streamEvents()

    setInterval(_=>{
        if(!playingGameId){
            if((new Date().getTime() - lastPlayedAt) > challengeTimeout * MINUTE){
                console.log(`idle timed out`)
                challengeRandomBot()
            }
        }
    }, challengeInterval * MINUTE)
})

// end launch
////////////////////////////////////////////////////////////////////////////////
