global.postMessage = function(msg){console.log(msg)}

var chessHandler

global.addEventListener = function(kind, callback){
    chessHandler = callback    
};
