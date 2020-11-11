move serve.sh serve.sh.old
move serve.bat serve.bat.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

move serve.sh.old serve.sh
move serve.bat.old serve.bat
