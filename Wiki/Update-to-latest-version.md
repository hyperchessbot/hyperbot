# Update to latest version

## Windows

In the terminal type:

```
move serve.sh serve.sh.old
move serve.bat serve.bat.old
move lc0goorm/weights.pb.gz lc0goorm/weights.pb.gz.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

move serve.sh.old serve.sh
move serve.bat.old serve.bat
move lc0goorm/weights.pb.gz.old lc0goorm/weights.pb.gz
```

If you already have the latest script:

```
cd hyperbot
latest
```

## Gitpod and goorm

In the terminal type:

```
mv serve.sh serve.sh.old
mv serve.bat serve.bat.old
mv lc0goorm/weights.pb.gz lc0goorm/weights.pb.gz.old

git remote add upstream https://github.com/hyperchessbot/hyperbot.git

git pull upstream master

mv serve.sh.old serve.sh
mv serve.bat.old serve.bat
mv lc0goorm/weights.pb.gz.old lc0goorm/weights.pb.gz
```

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