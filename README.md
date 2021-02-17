# Welcome to Hyper Bot !
## Create your own permanent Hyper Bot ( runs on Heroku, no Lc0 )
If you want to create your own permanent bot, do the following:  
  
Sign up to GitHub https://github.com/join , if you have not already.  
  
With your GitHub account visit https://github.com/hyperchessbot/hyperbot , then click on Fork.  
  
Create a BOT account if you do not already have one. To create one use an account that has not played any games yet, log into this account, then visit https://hypereasy.herokuapp.com/auth/lichess/bot , approve oauth and then on the page you are taken to click on 'Request upgrade to bot'.  
  
Create an API access token with your BOT account at https://lichess.org/account/oauth/token/create?scopes[]=challenge:read&scopes[]=challenge:write&scopes[]=bot:play&description=Hyper%20Bot%20TOKEN ( should have scopes Read incoming challenges / Create, accept, decline challenges / Play games with the bot API )  
  
Sign up to Heroku https://signup.heroku.com/ , if you have not already.  
  
At Heroku create a new app using New / Create new app. Choose Europe for region.  
  
In the app's dashboard go to the Deploy tab. Use the GitHub button to connect the app to your forked repo. Press Search to find your repositories, then select hyperbot. You need to deploy the master branch. Enable Automatic Deploys and press Deploy Branch, for the initial deploy. Wait for the build to finish.  
  
In Heroku Settings / Reveal Config Vars create a new variable TOKEN and set its value to your newly created access token, then create a new variable BOT_NAME and set its value to your bot's lichess username.  
  
For more detailed instructions and screenshots on setting up your Heroku app refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Creating-and-configuring-your-app-on-Heroku#creating-and-configuring-your-app-on-heroku .  
  
Congratulations, you have an up and running lichess bot.  
  
If you want to use 3-4-5 piece tablebases on Heroku, refer to this guide https://github.com/hyperchessbot/hyperbot/wiki/Update-Heroku-app-to-latest-version-using-Gitpod#enabling-syzygy-tablebases .
## Upgrade to bot and play games in your browser
To upgrade an account, that has played no games yet, to bot, and to make this bot accept challenges and play games in your browser, visit https://hypereasy.herokuapp.com .  
  
For detailed instructions see https://lichess.org/forum/off-topic-discussion/hyper-easy-all-variants-lichess-bot-running-in-your-browser#1 .
## Update Heroku app to latest version using Gitpod
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Update-Heroku-app-to-latest-version-using-Gitpod#update-heroku-app-to-latest-version-using-gitpod .
## Creating a MongoDb account
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Creating-a-MongoDb-account#creating-a-mongodb-account .
## Build external multi game PGN file with MongoDb book builder ( version 2 )
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Build-book-from-external-multi-game-PGN-file#build-book-from-external-multi-game-pgn-file .
## Install bot on Windows ( runs Lc0 )
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Install-bot-on-Windows-(-runs-Lc0-)#install-bot-on-windows--runs-lc0- .
## Install bot on goorm.io ( runs Lc0 )
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Install-bot-on-goorm.io-(-runs-Lc0-)#install-bot-on-goormio--runs-lc0- .
## Download a net for Lc0
Dowload a net from https://lczero.org/dev/wiki/best-nets-for-lc0 .  
  
Rename the weights file 'weights.pb.gz', then copy it to the 'lc0goorm' folder. Overwrite the old file.
## Update to latest version on Windows / goorm
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Update-to-latest-version-on-Windows-or-goorm#update-to-latest-version-on-windows--goorm .
## Explanation of files
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Explanation-of-files#git .
## Contribute to code
Refer to this Wiki https://github.com/hyperchessbot/hyperbot/wiki/Contribute-to-code#contribute-to-code .
## Discussion / Feedback
Discuss Hyper Bot on Discord https://discord.gg/8m3Muay .  
  
Post issues on GitHub https://github.com/hyperchessbot/hyperbot/issues .
## Config vars
**KEEP_ALIVE_URL** : set this to the full link of your bot home page ( https://[yourappname].herokuapp.com , where change [yourappname] to your Heroku app name ) if you want your bot to be kept alive from early morning till late night Heroku server time, keeping alive a free Heroku bot for 24/7 is not possible, because a free Heroku account has a monthly quota of 550 hours  
  
**ALWAYS_ON** : requires paid Heroku account, set it to 'true' to keep the bot alive 24/7, you have to set KEEP_ALIVE_URL to your bot's full home page link for ALWAYS_ON to work ( see also the explanation of KEEP_ALIVE_URL config var )  
  
**ALLOW_CORRESPONDENCE** : set it to 'true' to allow playing correspondence and infinite time control games  
  
**CORRESPONDENCE_THINKING_TIME** : think in correspondence as if the bot had that many seconds left on its clock ( default : 120 ), the actual thinking time will be decided by the engine  
  
**MONGODB_URI** : connect URI of your MongoDb admin user ( only the host, no slash after the host, do database specified, no query string ), if defined, your latest games or games downloaded from an url ( version 2 only ) will be added to the database on every startup, by default this config var is not defined  
  
**USE_MONGO_BOOK** : set it to 'true' to use the MongoDb book specified by MONGODB_URI  
  
**DISABLE_ENGINE_FOR_MONGO** : set it to 'true' to disable using engine completely when a MongoDb book move is available ( by default the bot may ignore a MongoDb book move at its discretion and use the engine instead for better performance and to allow for more varied play )  
  
**MONGO_VERSION** : MongoDb book builder version, possible values are 1 ( default, builds a book from bot games as downloaded from lichess as JSON ), 2 ( builds a book from bot games as downloaded from lichess as PGN, or from an arbitrary url specified in PGN_URL )  
  
**PGN_URL** : url for downloading a multi game PGN file for MongoDb book builder ( version 2 only )  
  
**MAX_GAMES** : maximum number of games to be built by MongoDb book builder  
  
**GENERAL_TIMEOUT** : timeout for event streams in seconds ( default : 15 )  
  
**ENGINE_THREADS** : engine Threads uci option ( default : 1 )  
  
**ENGINE_HASH** : engine Hash uci option in megabytes ( default : 16 )  
  
**ENGINE_CONTEMPT** : engine Contempt uci option in centipawns ( default : 24 )  
  
**ENGINE_MOVE_OVERHEAD** : engine Move Overhead uci option in milliseconds ( default : 500 )  
  
**ENGINE_SKILL_LEVEL** : engine Skill Level uci option, can be set from 0 to 20 ( default : 20 )  
  
**ALLOW_PONDER** : set it to 'true' to make the bot think on opponent time  
  
**USE_BOOK** : use opening explorer book  
  
**BOOK_DEPTH** : up to how many plies into the game should the bot use the book, choosing too high book depth is running the risk of playing unsound moves ( default : 20 )  
  
**BOOK_SPREAD** : select the move from that many of the top book moves, choosing to high book spread is running the risk of playing unsound moves ( default : 4 )  
  
**BOOK_RATINGS** : comma separated list of allowed book rating brackets, possible ratings are 1600, 1800, 2000, 2200, 2500 ( default : '2200,2500')  
  
**BOOK_SPEEDS** : comma separated list of allowed book speeds, possible speeds are bullet, blitz, rapid, classical ( default : 'blitz,rapid' )  
  
**LOG_API** : set it to 'true' to allow more verbose logging, logs are available in the Inspection / Console of the browser  
  
**USE_SCALACHESS** : set it to 'true' to use scalachess library and multi variant engine  
  
**ACCEPT_VARIANTS** : space separated list of variant keys to accept ( default : 'standard' ), for non standard variants USE_SCALACHESS has to be set to 'true' , example : `'standard crazyhouse chess960 kingOfTheHill threeCheck antichess atomic horde racingKings fromPosition'`  
  
**ACCEPT_SPEEDS** : space separated list of speeds to accept ( default : 'bullet blitz rapid classical' ), to allow correspondence set ALLOW_CORRESPONDENCE to 'true'  
  
**DISABLE_RATED** : set it to 'true' to reject rated challenges  
  
**DISABLE_CASUAL** : set it to 'true' to reject casual challenges  
  
**DISABLE_BOT** : set it to 'true' to reject bot challenges  
  
**DISABLE_HUMAN** : set it to 'true' to reject human challenges  
  
**GAME_START_DELAY** : delay between accepting challenge and starting to play game in seconds ( default : 2 )  
  
**CHALLENGE_INTERVAL** : delay between auto challenge attempts in minutes ( default : 30 )  
  
**CHALLENGE_TIMEOUT** : start attempting auto challenges after being idle for that many minutes ( default : 60 )  
  
**USE_NNUE** : space separated list of variant keys for which to use NNUE ( default: 'standard chess960 fromPosition' )  
  
**USE_LC0** : set it to 'true' to use Lc0 engine, only works with Windows and goorm installation, on Heroku and Gitpod you should not use it or set it to false  
  
**USE_POLYGLOT** : set it to 'true' to use polyglot opening book  
  
**WELCOME_MESSAGE** : game chat welcome message ( delay from game start : 2 seconds , default : 'coded by @hyperchessbotauthor' )  
  
**GOOD_LUCK_MESSAGE** : game chat good luck message ( delay from game start : 4 seconds , default : 'Good luck !' )  
  
**GOOD_GAME_MESSAGE** : game chat good game message ( delay from game end : 2 seconds , default : 'Good game !' )  
  
**DISABLE_SYZYGY** : set it to 'true' to disable using syzygy tablebases, note that syzygy tablebases are always disabled when USE_LC0 is set to 'true', syzygy tablebases are only installed for deployment on Heroku  
  
**APP_NAME** : Heroku app name ( necessary for interactive viewing of MongoDb book )  
  
**ABORT_AFTER** : abort game after that many seconds if the opponent fails to make their opening move ( default : 120 )  
  
**DECLINE_HARD** : set it to 'true' to explicitly decline unwanted challenges ( by default they are only ignored and can be accepted manually )  
  
**USE_SOLUTION** : set it to 'true' to use antichess solution, depends on http://magma.maths.usyd.edu.au/~watkins/LOSING_CHESS/WEB/browse.php?e2e3 api, may not work in the future  
  
**DISABLE_CHALLENGE_RANDOM** : set it to 'true' to disable challenging random bot ( default: enabled )