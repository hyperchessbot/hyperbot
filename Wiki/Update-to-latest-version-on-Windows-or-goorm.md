# Update to latest version on Windows / goorm

## Windows

In the terminal type:

```
cd hyperbot

move serve.bat serve.bat.old
move lc0goorm/weights.pb.gz lc0goorm/weights.pb.gz.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

move serve.bat.old serve.bat
move lc0goorm/weights.pb.gz.old lc0goorm/weights.pb.gz

echo "done updating"
```

If you already have the latest script:

```
cd hyperbot
latest
```

## Goorm

In the terminal type:

```
cd hyperbot

mv serve.sh serve.sh.old
mv lc0goorm/weights.pb.gz lc0goorm/weights.pb.gz.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

mv serve.sh.old serve.sh
mv lc0goorm/weights.pb.gz.old lc0goorm/weights.pb.gz

echo "done updating"
```

After this for subsequent deploys you can use the latest script.

If you already have the latest script:

```
cd hyperbot
./latest.sh
```

or

```
cd hyperbot
bash latest.sh
```

If during update a vim text editor opens up asking you to make a commit message, type `:qa!` to close this editor.