const path = require('path')

const { Worker } = require('worker_threads')

const worker = new Worker(path.join(__dirname, "scnode.js"))

let chessHandlers = []

worker.on('message', msg => {
    let reqid = msg.reqid    

    chessHandlers[reqid](msg)

    chessHandlers[reqid] = null
})

function chessHandler(data){    
    let reqid = chessHandlers.length

    chessHandlers.push(null)

    let pr = new Promise(resolve=>{
        chessHandlers[reqid] = resolve
    })

    data.reqid = reqid

    worker.postMessage({
        data,
        reqid: reqid
    })

    return pr
}

class Scalachess{
    constructor(variant){
        this.variant = variant || "standard"
    }

    init(){
        return new Promise(resolve=>{
            chessHandler({
                topic: 'init',
                payload: {
                    variant: this.variant
                }
            }).then(result=>{
                this.fen = result.payload.setup.fen
                this.pgnMoves = []
                this.uciMoves = []
                resolve(this.fen)
            })
        })        
    }

    async makeMoves(moves){
        return new Promise(resolve=>{
            let self = this;
            (async function(){
                for(let move of moves){
                    let result = await chessHandler({
                        topic: 'move',
                        payload: {
                            fen: self.fen,
                            variant: self.variant,
                            orig: move.substring(0,2),
                            dest: move.substring(2,4),
                            pgnMoves: self.pgnMoves,
                            uciMoves: self.uciMoves,
                            promotion: move.length > 4 ? move.substring(4,5) : undefined,
                            path: 0
                        }
                    })
                    let situation = result.payload.situation                
                    self.fen = situation.fen
                    self.pgnMoves = situation.pgnMoves
                    self.uciMoves = situation.uciMoves                                
                }            
                resolve(self.fen)
            })()                        
        })        
    }
}

module.exports = {
    chessHandler: chessHandler,
    Scalachess: Scalachess
}
