<!doctype html>
    <html>        
        <body>
            <h1>Welcome to Hyper Bot !</h1>            
            <h2>If you want to create your own permanent bot, do the following:</h2>
            <p><a href="https://github.com/join" rel="noopener noreferrer" target="_blank">Sign up to GitHub</a>
            <p>With your GitHub account visit <a href="https://github.com/hyperchessbot/hyperbot" rel="noopener noreferrer" target="_blank">hyperchessbot repo</a>, then click on Fork.
            <p><a href="https://signup.heroku.com/" rel="noopener noreferrer" target="_blank">Sign up to Heroku</a>
            <p>At Heroku create a new app using New / Create new app.</p>
            <p>In the app's dashboard go to the Deploy tab. Use the GitHub button to connect the app to your forked repo. You need to deploy the master branch. Enable Automatic Deploys and press Deploy Branch, for the initial deploy.</p>
            <p>Create an API access token with your BOT account ( should have scopes Read incoming challenges / Create, accept, decline challenges / Play games with the bot API ) and in Heroku Settings / Reveal Config Vars create a new variable TOKEN and set its value to your newly created access token and also create a variable BOT_NAME and set its value to your bot's username.
            <p>Congratulations, you have an up and running lichess bot.</p>    
            <h2>Install the bot locally:</h2>
            <p><a href="https://gitpod.io#https://github.com/hyperchessbot/hyperbot" rel="noopener noreferrer" target="_blank">Open the project's gitpod terminal</a></p>
            <p>npm install</p>
            <p>export TOKEN={BOT API token}</p>
            <p>export BOT_NAME={BOT username}</p>
            <p>node server.js</p>        
            <h2>Other config env vars:</h2>
            <p>GENERAL_TIMEOUT : for event streams in seconds ( default : 15 )</p>
            <p>ENGINE_THREADS : engine Threads option ( default : 1 )</p>
            <p>ENGINE_MOVE_OVERHEAD : engine Move Overhead option in milliseconds ( default : 500 )</p>
            <p>ALLOW_PONDER : set it to "true" to make the bot think on opponent time</p>
            <p>USE_BOOK : set it to "true" to use lichess opening explorer book</p>
            <p>BOOK_DEPTH : up to how many plies should the bot use the book ( default : 20 )</p>
            <p>BOOK_SPREAD : select the move from that many of the top book moves ( default : 4 )</p>
            <p>BOOK_RATINGS : comma separated list of allowed book rating brackets ( default : "2200,2500")</p>
            <p>BOOK_SPEEDS : comma separated list of allowed book speeds ( default : "blitz,rapid" )</p>
            <p>LOG_API : set it to "true" to allow more verbose logging</p>
            <p>USE_SCALACHESS : set it to "true" to use scalachess library and multi variant engine</p>
            <p>ACCEPT_VARIANTS : space separated list of variant keys to accept, for other than standard USE_SCALACHESS has to be true</p>
            <p></p>
        </body>
    </html>
    
