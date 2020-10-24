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

module.exports = {
    chessHandler: chessHandler
}
