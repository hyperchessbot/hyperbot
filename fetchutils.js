const fetch = require('node-fetch')

function streamNdjson(props){
    let headers = {
		Accept: "application/x-ndjson"
	}

    if(props.token) headers.Authorization = `Bearer ${props.token}`

    let lastTick = new Date().getTime()

    if(props.timeout){        
        let checkInterval = setInterval(_=>{
            if((new Date().getTime() - lastTick) > props.timeout * 1000){
                clearInterval(checkInterval)

                if(props.timeoutCallback) props.timeoutCallback()
            }
        }, props.timeout / 3)
    }

    let buffer = ""

    console.log("streamNdjson", props)

    fetch(props.url, {
        headers: headers
    })
    .then(response => {
		response.body.on('end', _ => {
			if(props.endcallback) props.endcallback()
		})
		
        response.body.on('data', chunk => {                      
            lastTick = new Date().getTime()

            buffer += chunk.toString()

            if(buffer.match(/\n/)){
                let parts = buffer.split(/\n/)

                buffer = parts.pop()

                for(let part of parts){
                    try{
                        let blob = JSON.parse(part)

                        if(props.log) console.log(blob)

                        if(props.callback){
                            props.callback(blob)
                        }
                    }catch(err){}
                }
            }
        })
    })
}

module.exports = {
    streamNdjson: streamNdjson
}