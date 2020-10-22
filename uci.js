const path = require('path')

class UciEngine{
    constructor(path){
        this.process = require('child_process').spawn(path)

        this.buffer = ""

        this.process.stdout.on('data', data =>{
            let content = data.toString()

            //console.log(`out: ${content}`)

            this.buffer += content

            if(this.buffer.match(/\n/)){
                let lines = this.buffer.split("\n")
                this.buffer = lines.pop()
                for(let line of lines) this.processLine(line)
            }
        })

        this.process.stderr.on('data', data =>{
            let content = data.toString()

            console.log(`err: ${content}`)
        })

        this.initInfo()
    }

    processLine(line){
        //console.log(`processing ( ${line.length} ): ${line}`)

        if(line.match(/^info string/)) return

        let m
        if(m=line.match(/depth (-?\d+)/)){
            this.currentDepth = parseInt(m[1])
        }

        while(this.info.depthInfos.length <= this.currentDepth){
            this.info.depthInfos.push({})
        }

        this.info.depthInfos[this.currentDepth].depth = this.currentDepth

        if(m=line.match(/time (\d+)/)){
            this.info.depthInfos[this.currentDepth].time = parseInt(m[1])
        }

        if(m=line.match(/score cp (-?\d+)/)){
            this.info.depthInfos[this.currentDepth].score = {unit: "cp", value: parseInt(m[1])}
        }

        if(m=line.match(/score mate (-?\d+)/)){
            this.info.depthInfos[this.currentDepth].score = {unit: "mate", value: parseInt(m[1])}
        }

        if(m=line.match(/ pv (.*)$/)){
            this.info.depthInfos[this.currentDepth].pv = m[1]
            this.info.depthInfos[this.currentDepth].pvMoves = m[1].split(" ")
        }

        if(line.match(/^bestmove/)){            
            if(m=line.match(/^bestmove ([^\s]+) ponder ([^\s]+)/)){
                this.info.bestmove = m[1]
                this.info.ponder = m[2]
            }else if(m=line.match(/^bestmove ([^\s]+)/)){
                this.info.bestmove = m[1]
                this.info.ponder = null
            }            
            if(this.onbestmove){                
                this.onbestmove()
            }
        }
    }

    issueCommand(command){
        this.process.stdin.write(`${command}\n`)
        console.log(`issue command: ${command}`)
        return this
    }

    quit(){
        console.log(`quitting engine`)
        return this.issueCommand("quit")
    }

    setoption(key, value){
        return this.issueCommand(`setoption name ${key} value ${value}`)
    }

    position(specifier, moves){
        let command = `position ${specifier}`
        if(moves) command += ` moves ${moves.join(" ")}`
        return this.issueCommand(command)
    }

    initInfo(){
        this.currentDepth = 0
        this.info = {
            bestmove: null,
            ponder: null,
            depthInfos: [{}]
        }
    }

    go(props){
        this.onbestmove = props.onbestmove        
        let command = `go`
        const keys = ["depth", "wtime", "winc", "btime", "binc"]
        for(let key of keys){
            if(typeof props[key] != "undefined"){
                command += ` ${key} ${props[key]}`            
            }
        }
        if(props.ponder) command += ` ponder`
        this.initInfo()
        return this.issueCommand(command)
    }

    ponderhit(onbestmove){        
        this.onbestmove = onbestmove
        return this.issueCommand(`ponderhit`)        
    }

    stop(onbestmove){        
        this.onbestmove = onbestmove
        return this.issueCommand(`stop`)        
    }

    gothen(props){
        return new Promise(resolve=>{
            this.go({...props, ...{onbestmove: _=>resolve(this.info)}})
        })
    }
}

module.exports = UciEngine
