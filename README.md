# Welcome to Hyper Bot !
## Create your own Hyper Bot
If you want to create your own permanent bot, do the following:  
  
Sign up to GitHub https://github.com/join , if you have not already.  
  
With your GitHub account visit https://github.com/hyperchessbot/hyperbot , then click on Fork.  
  
Sign up to Heroku https://signup.heroku.com/ , if you have not already.  
  
At Heroku create a new app using New / Create new app.  
  
In the app's dashboard go to the Deploy tab. Use the GitHub button to connect the app to your forked repo. You need to deploy the master branch. Enable Automatic Deploys and press Deploy Branch, for the initial deploy.  
  
Create an API access token with your BOT account ( should have scopes Read incoming challenges / Create, accept, decline challenges / Play games with the bot API ) and in Heroku Settings / Reveal Config Vars create a new variable TOKEN and set its value to your newly created access token and also create a variable BOT_NAME and set its value to your bot's username.  
  
Congratulations, you have an up and running lichess bot.
## Install the bot locally
Open the project's gitpod terminal https://gitpod.io#https://github.com/hyperchessbot/hyperbot , then type  
  
npm install  
  
export TOKEN={BOT API token}  
  
export BOT_NAME={BOT username}  
  
node server.js
## Discussion / Feedback
Discuss Hyper Bot on Discord https://discord.gg/8m3Muay .  
  
Post issues on GitHub https://github.com/hyperchessbot/hyperbot/issues .
## Config vars
**GENERAL_TIMEOUT** : for event streams in seconds ( default : 15 )  
  
**ENGINE_THREADS** : engine Threads option ( default : 1 )  
  
**ENGINE_HASH** : engine Hash option ( default : 16 )  
  
**ENGINE_MOVE_OVERHEAD** : engine Move Overhead option in milliseconds ( default : 500 )  
  
**ALLOW_PONDER** : set it to 'true' to make the bot think on opponent time  
  
**BOOK_DEPTH** : up to how many plies should the bot use the book ( default : 20 )  
  
**BOOK_SPREAD** : select the move from that many of the top book moves ( default : 4 )  
  
**BOOK_RATINGS** : comma separated list of allowed book rating brackets ( default : '2200,2500')  
  
**BOOK_SPEEDS** : comma separated list of allowed book speeds ( default : 'blitz,rapid' )  
  
**LOG_API** : set it to 'true' to allow more verbose logging  
  
**USE_SCALACHESS** : set it to 'true' to use scalachess library and multi variant engine  
  
**ACCEPT_VARIANTS** : space separated list of variant keys to accept ( default : 'standard' ), for non standard variants USE_SCALACHESS has to be set to 'true' , example : `'standard atomic horde racingKings'`  
  
**ACCEPT_SPEEDS** : space separated list of speeds to accept ( default : 'bullet blitz rapid classical' ), cannot play infinite or correspondence !  
  
**DISABLE_RATED** : set it to 'true' to reject rated challenges  
  
**DISABLE_CASUAL** : set it to 'true' to reject casual challenges  
  
**DISABLE_BOT** : set it to 'true' to reject bot challenges  
  
**DISABLE_HUMAN** : set it to 'true' to reject human challenges  
  
**GAME_START_DELAY** : delay between accepting challenge and starting to play game in seconds ( default : 2 )  
  
**CHALLENGE_INTERVAL** : delay between auto challenge attempts in minutes ( default : 30 )  
  
**CHALLENGE_TIMEOUT** : start attempting auto challenges after being idle for that many munutes ( default : 60 )