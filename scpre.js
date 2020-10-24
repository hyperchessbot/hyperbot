const { parentPort } = require('worker_threads')

global.postMessage = function(msg){parentPort.postMessage(msg)}

var chessHandler

global.addEventListener = function(kind, callback){
    chessHandler = callback    
};
