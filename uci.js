const path = require('path')

class UciEngine{
    constructor(path){
        this.process = require('child_process').spawn(path)

        this.buffer = ""

        this.process.stdout.on('data', data =>{
            let content = data.toString()

            console.log(`out: ${content}`)

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
    }

    processLine(line){
        console.log(`processing ( ${line.length} ): ${line}`)
    }
}

module.exports = UciEngine

const engine = new UciEngine(path.join(__dirname, "stockfish12"))

