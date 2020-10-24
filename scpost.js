let e = {
    data:{
        topic: 'init',
        payload: {
            variant: 'chess960'
        }
    }
}

console.log("event", e)

chessHandler(e)
