<!doctype html>
    <html>        
        <body>
            <h1>HyperBotPatzer</h1>
            <p>The full README of the original project can be found in the master repository</p>  
            <h2>Config env vars:</h2>
            <p>GENERAL_TIMEOUT - for event streams in seconds (Default: 5)</p>
            <p>ENGINE_THREADS - engine Threads option* (Default: 1)</p>
            <p>ENGINE_HASH - engine Hash size in mb** (Default: 64)</p>
            <p>ENGINE_CONTEMPT - engine Contempt value [for Stockfish] (Default: 24)</p>
            <p>ENGINE_MOVE_OVERHEAD : engine Move Overhead option in milliseconds (Default: 1000)</p>
            <p>*Heroku's dynos may not be comparable to threads. Minimum is 1 thread </p>
            <p>**Smaller hash sizes are better for fast time controls. Heroku's max RAM for free dynos is 512 mb</p>
            <p></p>
        </body>
    </html>
    
