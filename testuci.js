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
	let sc = new Scalachess('crazyhouse')
	console.log(await sc.init())
	console.log(await sc.makeMoves(['e2e4','d7d5','e4d5','e7e6','P@g4']))
})()

