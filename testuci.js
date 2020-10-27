if(false){
	const path = require('path')

	const UciEngine = require('@easychessanimations/uci')

	const engine = new UciEngine(path.join(__dirname, 'stockfish12'))

	engine.logProcessLine = false

	engine.position("startpos", ["e2e4", "c7c5"]).go({wtime: 3000, winc: 0, btime: 3000, binc: 0, ponder: true})

	console.log(engine.pondering)

	setTimeout(_=>{
	    /*console.log("stopping engine")
	    engine.stop(_=>{
	        console.log("stopped", engine.info)
	        engine.quit()
	    })*/

	    engine.position("startpos", ["e2e4", Math.random()>0.5?"c7c6":"c7c5"]).gothen({wtime: 3000, winc: 0, btime: 3000, binc: 0}).then(result=>{
	        console.log(result.bestmove)
	        engine.quit()
	    })
	}, 3000)	
}

const { Scalachess } = require('@easychessanimations/scalachess');

(async function(){
	let sc = new Scalachess('chess960', 'nbrqkrbn/pppppppp/8/8/8/8/PPPPPPPP/NBRQKRBN w KQkq - 0 1')
	console.log(await sc.init())
	console.log(await sc.makeMoves(['h1g3','a7a6','f2f3','b7b6','g1e3','c7c6','e1f1']))
})()

