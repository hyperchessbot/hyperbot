mv serve.sh serve.sh.old
mv serve.bat serve.bat.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

mv serve.sh.old serve.sh
mv serve.bat.old serve.bat
