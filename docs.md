## Create your own Hyper Bot
Create your own Hyper Bot.  
  
Join GitHub if you have not already.
## Discussion / Feedback
Discuss Hyper Bot on Discord.  
  
Post issues on GitHub.
## Config vars
**GENERAL_TIMEOUT** for event streams in seconds ( default : 15 )  
  
**ENGINE_THREADS** engine Threads option ( default : 1 )  
  
**ENGINE_MOVE_OVERHEAD** engine Move Overhead option in milliseconds ( default : 500 )  
  
**ALLOW_PONDER** set it to 'true' to make the bot think on opponent time  
  
**BOOK_DEPTH** up to how many plies should the bot use the book ( default : 20 )  
  
**BOOK_SPREAD** select the move from that many of the top book moves ( default : 4 )  
  
**BOOK_RATINGS** comma separated list of allowed book rating brackets ( default : '2200,2500')  
  
**BOOK_SPEEDS** comma separated list of allowed book speeds ( default : 'blitz,rapid' )  
  
**LOG_API** set it to 'true' to allow more verbose logging  
  
**USE_SCALACHESS** set it to 'true' to use scalachess library and multi variant engine  
  
**ACCEPT_VARIANTS** space separated list of variant keys to accept, for other than standard USE_SCALACHESS has to be set to 'true'|'standard atomic horde racingKings'