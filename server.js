const fs = require('fs')
const { Section, EnvVars } = require('./smartmd.js')

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

let envKeys = []

const lichessBotName = process.env.BOT_NAME || "chesshyperbot"
const generalTimeout = parseInt(process.env.GENERAL_TIMEOUT || "15")
envKeys.push('GENERAL_TIMEOUT')
const engineThreads = process.env.ENGINE_THREADS || "1"
envKeys.push('ENGINE_THREADS')
const engineMoveOverhead = process.env.ENGINE_MOVE_OVERHEAD || "500"
envKeys.push('ENGINE_MOVE_OVERHEAD')
const queryPlayingInterval = parseInt(process.env.QUERY_PLAYING_INTERVAL || "60")
envKeys.push('QUERY_PLAYING_INTERVAL')
const allowPonder = process.env.ALLOW_PONDER == "true"
envKeys.push('ALLOW_PONDER')
const useBook = process.env.USE_BOOK == "true"
envKeys.push('USE_BOOK')
const bookDepth = parseInt(process.env.BOOK_DEPTH || "20")
envKeys.push('BOOK_DEPTH')
const bookSpread = parseInt(process.env.BOOK_SPREAD || "4")
envKeys.push('BOOK_SPREAD')
const bookRatings = (process.env.BOOK_RATINGS || "2200,2500").split(",")
envKeys.push('BOOK_RATINGS')
const bookSpeeds = (process.env.BOOK_SPEEDS || "blitz,rapid").split(",")
envKeys.push('BOOK_SPEEDS')
const logApi = process.env.LOG_API == "true"
envKeys.push('LOG_API')
const challengeInterval = parseInt(process.env.CHALLENGE_INTERVAL || "30")
//envKeys.push('CHALLENGE_INTERVAL')
const challengeTimeout = parseInt(process.env.CHALLENGE_TIMEOUT || "60")
envKeys.push('CHALLENGE_TIMEOUT')
const urlArray = (name,items) => items.map(item=>`${name}[]=${item}`).join("&")
const useScalachess = process.env.USE_SCALACHESS == "true"
envKeys.push('USE_SCALACHESS')
const acceptVariants = (process.env.ACCEPT_VARIANTS || "standard").split(" ")
envKeys.push('ACCEPT_VARIANTS')
const gameStartDelay = parseInt(process.env.GAME_START_DELAY || "5")
//envKeys.push('GAME_START_DELAY')

const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

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

const { streamNdjson } = require('@easychessanimations/fetchutils')
const lichessUtils = require("@easychessanimations/lichessutils")

const { chessHandler, Scalachess } = require("@easychessanimations/scalachess")

const { UciEngine, setLogEngine } = require('@easychessanimations/uci')

const engine = new UciEngine(path.join(__dirname, useScalachess ? 'stockfish12m' : 'stockfish12'))

const { Chess } = require('chess.js')

let playingGameId = null

const { sseMiddleware, setupStream, ssesend, TICK_INTERVAL } = require('@easychessanimations/sse')

app.use(sseMiddleware)

setupStream(app)

function logPage(content){
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

function requestBook(state){
    return new Promise(resolve=>{
        let reqUrl = `https://explorer.lichess.ovh/lichess?fen=${state.fen}&${urlArray("ratings", bookRatings)}&${urlArray("speeds", bookSpeeds)}&moves=${bookSpread}&variant=${state.variant}`
        
        if(logApi) console.log(reqUrl)

        fetch(reqUrl).then(response=>response.text().then(content=>{
            try{
                let blob = JSON.parse(content)

                resolve(blob)
            }catch(err){resolve(null)}
        }))
    })    
}

async function makeMove(gameId, state, moves){
    if(gameId != playingGameId){
        logPage(`refused to make move for invalid game ${gameId} ( playing : ${playingGameId} )`)
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

    if(useBook && (moves.length < bookDepth)){
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
                        break
                    }                                            
                }
            }
        }
    }

    if(bookalgeb){
        logPage(`lichess book move founnd ${bookalgeb}`)
        enginePromise = Promise.resolve({
            bestmove: bookalgeb,
            source: "lichess book"
        })
    }

    if(!enginePromise){
        logPage(`engine thinking with ${engineThreads} thread(s) and overhead ${engineMoveOverhead}`)
         enginePromise = engine
        //.position(`fen ${state.initialFen}`, moves)
        .position('startpos', moves)
        .gothen({ wtime: state.wtime, winc: state.winc, btime: state.btime, binc: state.binc, ponderAfter: allowPonder })
    }else{
        engine.stop()
    }
    
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

        lichessUtils.postApi({
            url: lichessUtils.makeBotMoveUrl(gameId, bestmove), log: logApi, token: process.env.TOKEN,
            callback: content => {
                if(logApi) logPage(`move ack: ${content}`)
                if(content.match(/error/)){
                    logPage(`retry move for ${gameId} ${moves}`)
					
					engine.spawn() // restart engine for retry move

                    setTimeout(_=>makeMove(gameId, state, moves), gameStartDelay * 1000)
                }
            }
        })
    })
}

app.get('/', (req, res) => {
    res.send(`
    <!doctype html>
    <html>
        <head>
            <title>Hyper Bot</title>
            <style>
            p {
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
				function showGame(id, fen, orientation, title){
					document.getElementById("showGame").innerHTML = \`
					<!--<iframe height="400" width="800" src="https://lichess.org/embed/\${id}?theme=maple2&bg=auto&rnd=\${Math.random()}"></iframe>-->
					<iframe height="400" width="800" src="/board?fen=\${fen}&orientation=\${orientation}&title=${title}"></iframe>
					\`
				}
				function refreshGame(id, fen, orientation, title){
					showGame(id, fen, orientation, title)
				}
			</script>
            <h1>Welcome to Hyper Bot !</h1>            
            <p><a href="https://lichess.org/@/${lichessBotName}" rel="noopener noreferrer" target="_blank">${lichessBotName}</a> is powered by Hyper Bot 
            ( <a href="/chr" rel="noopener noreferrer" target="_blank" onclick="challengeRandom(event)">challenge random bot by ${lichessBotName}</a> |
            <a href="/docs" rel="noopener noreferrer" target="_blank">view docs</a> )
            </p>
            <p id="logBestmove" style="font-family: monospace;"></p>            
			<p id="showGame"></p>
            <script>            
            function processSource(blob){
                if(blob.kind == "tick"){                    
                    if(isFirstSourceTick) console.log("stream started ticking")
                }

				if(blob.kind == "showGame"){
					showGame(blob.gameId, blob.fen, blob.orientation, blob.title)
				}

				if(blob.kind == "refreshGame"){
					refreshGame(blob.gameId, blob.fen, blob.orientation, blob.title)
				}

                if(blob.kind == "logPage"){
                    let content = blob.content

                    console.log(content)

                    if(content.match(/^bestmove/)) document.getElementById("logBestmove").innerHTML = content
                }
            }

            setupSource(processSource, ${TICK_INTERVAL})    
            </script>
        </body>
    </html>
    `)  
})

function playGame(gameId){
    logPage(`playing game: ${gameId}`)	

    engine
    .setoption("Threads", engineThreads)
    .setoption("Move Overhead", engineMoveOverhead)

    setTimeout(_=>lichessUtils.gameChat(gameId, "all", `${lichessBotName} running on https://github.com/hyperchessbot/hyperbot`), 2000)
    setTimeout(_=>lichessUtils.gameChat(gameId, "all", `Good luck !`), 4000)

    playingGameId = gameId

    let botWhite, variant, initialFen, whiteName, blackName

    streamNdjson({url: lichessUtils.streamBotGameUrl(gameId), token: process.env.TOKEN, timeout: generalTimeout, log: logApi, timeoutCallback: _=>{
        logPage(`game ${gameId} timed out ( playing : ${playingGameId} )`)
        
        if(playingGameId == gameId) playGame(gameId)
    }, callback: async function(blob){        
        if(blob.type == "gameFull"){                
			whiteName = blob.white.name
			blackName = blob.black.name
			
            botWhite = whiteName == lichessBotName

            variant = blob.variant.key
            initialFen = blob.initialFen

            if(initialFen == 'startpos') initialFen = startFen

            if(useScalachess){
                engine
                .setoption("UCI_Variant", variant.toLowerCase())
            }            
        }

        if(blob.type != "chatLine"){                			
            let moves = []

            let state = blob.type == "gameFull" ? blob.state : blob

            state.variant = variant
            state.initialFen = initialFen
            state.fen = initialFen

            if(state.moves){
                moves = state.moves.split(" ")

                if(useScalachess){
                    const scalachess = new Scalachess(state.variant)
                    await scalachess.init(state.variant)
                    state.fen = await scalachess.makeMoves(moves)
                }else{
                    const chess = new Chess()
                    for(let move of moves) chess.move(move, {sloppy:true})
                    state.fen = chess.fen()
                }
            }
			
			state.orientation = botWhite ? "w" : "b"
			state.title = `${whiteName} - ${blackName}`
			
			ssesend({
				kind: "refreshGame",
				gameId: gameId,
				fen: state.fen,
				orientation: state.orientation,
				title: state.title
			})

            let whiteMoves = (moves.length % 2) == 0
            let botTurn = (whiteMoves && botWhite) || ((!whiteMoves) && (!botWhite))

            if(logApi) logPage(`bot turn: ${botTurn}`)

            if(botTurn){
                try{
                    makeMove(gameId, state, moves)
                }catch(err){console.log(err)}
            }
        }     
    }})
}

function streamEvents(){
    streamNdjson({url: lichessUtils.streamEventsUrl, token: process.env.TOKEN, timeout: generalTimeout, log: logApi, timeoutCallback: _=>{
        logPage(`event stream timed out`)

        streamEvents()
    }, callback: blob => {        
        if(blob.type == "challenge"){
            let challenge = blob.challenge
            let challengeId = challenge.id

            if(playingGameId){
                logPage(`can't accept challenge ${challengeId}, already playing`)
            }else if(challenge.speed == "correspondence"){
                logPage(`can't accept challenge ${challengeId}, no correspondence`)
            }else if(!acceptVariants.includes(challenge.variant.key)){
                logPage(`can't accept challenge ${challengeId}, non standard`)
            }else{
                lichessUtils.postApi({
                    url: lichessUtils.acceptChallengeUrl(challengeId), log: logApi, token: process.env.TOKEN,
                    callback: content => logPage(`accept response: ${content}`)
                })
            }
        }

        if(blob.type == "gameStart"){                
            let gameId = blob.game.id

            if(playingGameId){
                logPage(`can't start new game ${gameId}, already playing`)
            }else{
				engine.spawn() // restart engine for new game
				
                setTimeout(_=>playGame(gameId), gameStartDelay * 1000)
            }                    
        }

        if(blob.type == "gameFinish"){                
            let gameId = blob.game.id

            if(gameId == playingGameId){
                if(gameId == playingGameId){
                    playingGameId = null
                }
                
                logPage(`game ${gameId} terminated ( playing : ${playingGameId} )`)

                engine.stop()

                setTimeout(_=>lichessUtils.gameChat(gameId, "all", `Good game !`), 2000)
            }
        }         
    }})
}

function challengeBot(bot){
    return new Promise(resolve=>{
        lichessUtils.postApi({
            url: lichessUtils.challengeUrl(bot), log: logApi, token: process.env.TOKEN,
            body: `rated=${Math.random()>0.5?"true":"false"}&clock.limit=${60 * (Math.floor(Math.random() * 5) + 1)}&clock.increment=0`,
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

app.get('/chr', (req, res) => {
    challengeRandomBot().then(result=>res.send(result))
})

app.get('/docs', (req, res) => {
    if(!docs){
        res.send(`page not ready, try again a little later`)
        return
    }
    
    res.send(`
    <div id="root"></div>
    <script src="https://unpkg.com/@easychessanimations/foo@1.0.21/lib/fooweb.js"></script>
	<script src="/smartdom.js"></script>
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

app.get('/board', (req, res) => {
    res.send(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Chessboard</title>
		<link href="chessboard.css" rel="stylesheet">
		<script src="chessboard.js"></script>
	</head>
	<body>
		<div>${req.query.title || "? - ?"}</div>
		<div id="board"></div>

		<script>
			let board = new window.ChessBoard('board', {
				size: ${parseInt(req.query.size || "45")},
				fen: "${(req.query.fen || startFen).split(" ")[0]}",
				orientation: "${req.query.orientation || "w"}"
			})			
		</script>
	</body>
	</html>
	`)
})

app.use('/', express.static(__dirname))

app.listen(port, _ => {
    console.log(`Hyperbot listening on port ${port} !`)

    if(KEEP_ALIVE_URL){
        console.log(`keep alive interval: ${KEEP_ALIVE_INTERVAL} , url: ${KEEP_ALIVE_URL}`)

        setInterval(_=>{
            let hours = new Date().getHours()
            if((hours > 5)&&(hours<23)){
                console.log(`hours ok: ${hours}, keep alive`)
                fetch(KEEP_ALIVE_URL)
            }        
        }, KEEP_ALIVE_INTERVAL * 60 * 1000)
    }

    streamEvents()

    setInterval(_=>{
        fetch(`https://lichess.org/api/user/${lichessBotName}`).then(response=>response.text().then(content=>{
            try{
                let blob = JSON.parse(content)

                let playing = blob.count.playing

                if(logApi) logPage(`playing: ${playing}`)

                if(!playing){
                    if(playingGameId && false){
                        logPage(`inconsistent playing information, resetting playing game id`)

                        playingGameId = null
                    }
                }
            }catch(err){console.log(err)}
        }))
    }, queryPlayingInterval * 1000)

    let lastPlayedAt = 0
    setInterval(_=>{
        if(playingGameId){
            lastPlayedAt = new Date().getTime()
        }else{
            if((new Date().getTime() - lastPlayedAt) > challengeTimeout * 60 * 1000){
                console.log(`idle timed out`)
                challengeRandomBot()
            }
        }
    }, challengeInterval * 60 * 1000)
})
