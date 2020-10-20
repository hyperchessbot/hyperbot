const lichessBotName = process.env.BOT_NAME || "chesshyperbot"

const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const fetch = require('node-fetch')

const Engine = require('node-uci').Engine

const engine = new Engine(path.join(__dirname, 'stockfish12'))

engine.init()

const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL
const KEEP_ALIVE_INTERVAL = parseInt(process.env.KEEP_ALIVE_INTERVAL || "5")

let playingGameId = null

app.use('/', express.static(__dirname))

app.get('/', (req, res) => {
    res.send(`
    <!doctype html>
    <html>
        <head>
            <title>Hyper Bot</title>
            <style>
            p {
                max-width: 700px;
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
        </head>
        <body>
            <h1>Welcome to Hyper Bot !</h1>            
            <p><a href="https://lichess.org/@/${process.env.BOT_NAME}">${process.env.BOT_NAME}</a> is powered by Hyper Bot</p>
            <h2>If you want to create your own permanent bot, do the following:</h2>
            <p><a href="https://github.com/join">Sign up to GitHub</a>
            <p>With your GitHub account visit <a href="https://github.com/hyperchessbot/hyperbot">hyperchessbot repo</a>, then click on Fork.
            <p><a href="https://signup.heroku.com/">Sign up to Heroku</a>
            <p>At Heroku create a new app using New / Create new app.</p>
            <p>In the app's dashboard go to the Deploy tab. Use the GitHub button to connect the app to your forked repo. You need to deploy the main branch. Enable Automatic Deploys and press Deploy Branch, for the initial deploy.</p>
            <p>Create an API access token with your BOT account ( should have scopes Read incoming challenges / Create, accept, decline challenges / Play games with the bot API ) and in Heroku Settings / Reveal Config Vars create a new variable TOKEN and set its value to your newly created access token and also create a variable BOT_NAME and set its value to your bot's username.
            <p>Congratulations, you have an up and running lichess bot.</p>
            <h2>Install the bot locally:</h2>
            <p><a href="https://gitpod.io#https://github.com/hyperchessbot/hyperbot">Open the project's gitpod terminal</a></p>
            <p>npm install</p>
            <p>export TOKEN={BOT API token}</p>
            <p>export BOT_NAME={BOT username}</p>
            <p>node server.js</p>
            <script></script>
        </body>
    </html>
    `)  
})

function stream(url, callback){
    fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN}`
        }
    })
    .then(response => {
        response.body.on('data', chunk => {                        
            callback(chunk.toString())
        })
    })
}

function playGame(gameId){    
    console.log(`playing game : ${gameId}`)

    playingGameId = gameId

    let url = `https://lichess.org/api/bot/game/stream/${gameId}`

    let botWhite

    let lastGameTick = new Date().getTime()

    let checkGameInterval = setInterval(_=>{
        if((new Date().getTime() - lastGameTick) > 30 * 1000){
            console.log(`game ${gameId} timed out ( playing : ${playingGameId} )`)
            clearInterval(checkGameInterval)
            
            if(playingGameId == gameId) playGame(gameId)
        }
    }, 10 * 1000)        

    stream(url, data => {        
        lastGameTick = new Date().getTime()

        try{
            let blob = JSON.parse(data)
            console.log(blob)

            if(blob.type == "gameFull"){                
                botWhite = blob.white.name == lichessBotName
            }

            if(blob.type != "chatLine"){                
                let moves = []

                let state = blob.type == "gameFull" ? blob.state : blob

                if(state.moves){
                    moves = state.moves.split(" ")
                }

                let whiteMoves = (moves.length % 2) == 0
                let botTurn = (whiteMoves && botWhite) || ((!whiteMoves) && (!botWhite))

                if(botTurn){
                    engine
                    .chain()                    
                    .position('startpos', moves)
                    .go({ wtime: state.wtime, winc: state.winc, btime: state.btime, binc: state.binc })
                    .then(result => {
                        let bestmove = result.bestmove

                        console.log("bestmove:", bestmove)

                        let moveUrl = `https://lichess.org/api/bot/game/${gameId}/move/${bestmove}`

                        fetch(moveUrl, {
                            method:"POST",
                            body:"",
                            headers:{
                                Authorization: `Bearer ${process.env.TOKEN}`
                            }
                        })
                        .then(response=>response.text().then(content=>
                            console.log("move ack:", content)))
                    })
                }
            }
        }catch(err){/*console.log(err)*/}
    })
}

function streamEvents(){
    let lastTick = new Date().getTime()

    let checkInterval = setInterval(_=>{
        if((new Date().getTime() - lastTick) > 30 * 1000){
            console.log("event stream timed out")
            clearInterval(checkInterval)
            
            streamEvents()
        }
    }, 10 * 1000)        

    let streamUrl = `https://lichess.org/api/stream/event`

    stream(streamUrl, data => {
        lastTick = new Date().getTime()

        if(data.match(/[^\s]+/)){
            try{
                let blob = JSON.parse(data)
                console.log(blob)

                if(blob.type == "challenge"){
                    let challenge = blob.challenge
                    let challengeId = challenge.id
                    
                    let acceptUrl = `https://lichess.org/api/challenge/${challengeId}/accept`

                    if(playingGameId){
                        console.log("can't accept challenge, already playing")
                    }else{
                        fetch(acceptUrl, {
                            method: "POST",
                            body: "",
                            headers: {
                                Authorization: `Bearer ${process.env.TOKEN}`                        
                            }
                        })
                        .then(response=>response.text().then(content =>
                            console.log("accept response :", content)))
                    }
                }

                if(blob.type == "gameStart"){                
                    if(playingGameId){
                        console.log("can't start new game, already playing")
                    }else{
                        let gameId = blob.game.id
                        playGame(gameId)
                    }                    
                }

                if(blob.type == "gameFinish"){                
                    let gameId = blob.game.id

                    if(gameId == playingGameId){
                        playingGameId = null
                    }
                }
            }catch(err){}
        }
    })
}

app.listen(port, _ => {
    console.log(`Hyperbot listening on port ${port} !`)

    if(KEEP_ALIVE_URL){
        console.log("keep alive interval", KEEP_ALIVE_INTERVAL, "url", KEEP_ALIVE_URL)
        setInterval(_=>{
            let hours = new Date().getHours()
            if((hours > 5)&&(hours<23)){
                console.log("hours ok", hours, "keep alive")
                fetch(KEEP_ALIVE_URL)
            }        
        }, KEEP_ALIVE_INTERVAL * 60 * 1000)
    }

    streamEvents()
})
