move serve.sh serve.sh.old
move serve.bat serve.bat.old
mv lc0goorm/weights.pb.gz lc0goorm/weights.pb.gz.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

move serve.sh.old serve.sh
move serve.bat.old serve.bat
mv lc0goorm/weights.pb.gz.old lc0goorm/weights.pb.gz
