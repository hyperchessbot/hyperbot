# Contribute to code

## Open project in Gitpod

Visit your forked repo, then press the Gitpod button

![](https://i.imgur.com/MEvgqK6.png)

If you don't have the Gitpod button, prefix the link of the forked repo with `https://gitpod.io/#` and visit the resulting link.

In the top right corner click on your account login and from the menu select Open Access Control. Enable "write public repos".

![](https://i.imgur.com/5fbBCKZ.jpg)

Use the terminal to type in commands:

![](https://i.imgur.com/mawGHk7.png)

## Create a development branch and switch to it

If you don't already have a development branch, type

```
git checkout -b dev
```

If you already have a development branch, type

```
git checkout dev
```

## Update development branch to main project current state

```
git fetch upstream master
git reset --hard upstream/master
```

## Edit source files to modify code

Edit the source files to modify the code.

### Example

Open `server.js` and change `if(scoreUnit == "cp") scoreValue = scoreValue` to `if(scoreUnit == "cp") scoreValue = scoreValue / 100` in order to display score in pawns instead of centipawns.

![](https://i.imgur.com/a7qnVYL.png)

Save the file using Ctrl + S or File / Save.

## Push code change to your development branch

```
git add . -A
git commit -m "Show cp score in pawns"
git push --force origin dev
```

## Create pull request

Visit your forked repo and select the development branch

![](https://i.imgur.com/mGoGa72.png)

Press Compare and pull request

![](https://i.imgur.com/bGL8mxx.png)

Leave a comment if necessary, then press Create pull request

![](https://i.imgur.com/vy2rmoR.png)

You have created a pull request and from now on it depends on the maintainer of the main project to accept or reject it.

## Update your app on accepted pull request

If your pull request has been accepted, you can update your app according to these Wikis

### Update Heroku app

https://github.com/hyperchessbot/hyperbot/wiki/Update-Heroku-app-to-latest-version-using-Gitpod#update-heroku-app-to-latest-version-using-gitpod

### Update Windows / goorm installation

https://github.com/hyperchessbot/hyperbot/wiki/Update-to-latest-version-on-Windows-or-goorm#update-to-latest-version-on-windows--goorm
