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
    }catch(err){console.log(err)}
}))

const { streamNdjson } = require('@easychessanimations/fetchutils')
const lichessUtils = require("@easychessanimations/lichessutils")

const { chessHandler, Scalachess } = require("@easychessanimations/scalachess")

const UciEngine = require('@easychessanimations/uci')

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

                    makeMove(gameId, state, moves)
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
            <h1>Welcome to Hyper Bot !</h1>            
            <p><a href="https://lichess.org/@/${lichessBotName}" rel="noopener noreferrer" target="_blank">${lichessBotName}</a> is powered by Hyper Bot 
            ( <a href="/chr" rel="noopener noreferrer" target="_blank">challenge random bot by ${lichessBotName}</a> )
            </p>
            <p id="logBestmove" style="font-family: monospace;"></p>
            <h2>If you want to create your own permanent bot, do the following:</h2>
            <p><a href="https://github.com/join" rel="noopener noreferrer" target="_blank">Sign up to GitHub</a>
            <p>With your GitHub account visit <a href="https://github.com/hyperchessbot/hyperbot" rel="noopener noreferrer" target="_blank">hyperchessbot repo</a>, then click on Fork.
            <p><a href="https://signup.heroku.com/" rel="noopener noreferrer" target="_blank">Sign up to Heroku</a>
            <p>At Heroku create a new app using New / Create new app.</p>
            <p>In the app's dashboard go to the Deploy tab. Use the GitHub button to connect the app to your forked repo. You need to deploy the master branch. Enable Automatic Deploys and press Deploy Branch, for the initial deploy.</p>
            <p>Create an API access token with your BOT account ( should have scopes Read incoming challenges / Create, accept, decline challenges / Play games with the bot API ) and in Heroku Settings / Reveal Config Vars create a new variable TOKEN and set its value to your newly created access token and also create a variable BOT_NAME and set its value to your bot's username.
            <p>Congratulations, you have an up and running lichess bot.</p>
            <h2>Install the bot locally:</h2>
            <p><a href="https://gitpod.io#https://github.com/hyperchessbot/hyperbot" rel="noopener noreferrer" target="_blank">Open the project's gitpod terminal</a></p>
            <p>npm install</p>
            <p>export TOKEN={BOT API token}</p>
            <p>export BOT_NAME={BOT username}</p>
            <p>node server.js</p>
            <h2>Other config env vars:</h2>
            ${envKeys.filter(key=>process.env[key]).map(key => `<b>${key}</b> = <div style="font-weight: bold;height: 20px;display:inline-block;color:#070;">${process.env[key]}</div>`).join(`<br>\n`)}
            <p>GENERAL_TIMEOUT : for event streams in seconds ( default : 15 )</p>
            <p>ENGINE_THREADS : engine Threads option ( default : 1 )</p>
            <p>ENGINE_MOVE_OVERHEAD : engine Move Overhead option in milliseconds ( default : 500 )</p>
            <p>ALLOW_PONDER : set it to "true" to make the bot think on opponent time</p>
            <p>USE_BOOK : set it to "true" to use lichess opening explorer book</p>
            <p>BOOK_DEPTH : up to how many plies should the bot use the book ( default : 20 )</p>
            <p>BOOK_SPREAD : select the move from that many of the top book moves ( default : 4 )</p>
            <p>BOOK_RATINGS : comma separated list of allowed book rating brackets ( default : "2200,2500")</p>
            <p>BOOK_SPEEDS : comma separated list of allowed book speeds ( default : "blitz,rapid" )</p>
            <p>LOG_API : set it to "true" to allow more verbose logging</p>
            <p>USE_SCALACHESS : set it to "true" to use scalachess library and multi variant engine</p>
            <p>ACCEPT_VARIANTS : space separated list of variant keys to accept, for other than standard USE_SCALACHESS has to be set to "true"</p>
            <script>            
            function processSource(blob){
                if(blob.kind == "tick"){                    
                    if(isFirstSourceTick) console.log("stream started ticking")
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

    let botWhite, variant, initialFen

    streamNdjson({url: lichessUtils.streamBotGameUrl(gameId), token: process.env.TOKEN, timeout: generalTimeout, log: logApi, timeoutCallback: _=>{
        logPage(`game ${gameId} timed out ( playing : ${playingGameId} )`)
        
        if(playingGameId == gameId) playGame(gameId)
    }, callback: async function(blob){        
        if(blob.type == "gameFull"){                
            botWhite = blob.white.name == lichessBotName

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
    <script>
    let docs = JSON.parse(\`${JSON.stringify(docs, null, 2)}\`)
    let app = div().w(960).addStyle("boxShadow", "5px 5px #eee").pad(5).addStyle("paddingLeft", "10px").bc("#ccc").a(Object.entries(docs).map(entry=>div().w(950).fl().addStyle("marginTop", "3px").addStyle("marginBottom", "6px").addStyle("boxShadow", "5px 5px #abc").a(
            div().c("#007").fl().aic().addStyle("minWidth", "300px").pad(3).addStyle("paddingLeft", "10px").mar(1).bc("#eee").fwb().a(div().html(entry[0])),
            div().addStyle("width", "100%").pad(3).addStyle("paddingLeft", "10px").mar(1).bc("#ffe").c("#070").a(div().html(entry[1]))
        )
    ))
    console.log(app)
    document.getElementById("root").appendChild(app.e)
    </script>
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
                    if(playingGameId){
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
