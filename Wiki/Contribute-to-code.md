# Contribute to code

## Opening project in Gitpod

Visit your forked repo, then press the Gitpod button

![](https://i.imgur.com/MEvgqK6.png)

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

Open `server.js` and change `let scoreValue = parseInt(m[1])` to `let scoreValue = parseInt(m[1])/100` in order to display score in pawns instead of centipawns.

![](https://i.imgur.com/604lysM.png)

Save the file using Ctrl + S or File / Save.

## Push code change to your development branch

```
git push origin dev
```

## Create pull request

Visit your forked repo and select the development branch

![](https://i.imgur.com/mGoGa72.png)

Press Compare and pull request

![](https://i.imgur.com/bGL8mxx.png)

Leave a comment if necessary, then press Create pull request

![](https://i.imgur.com/vy2rmoR.png)

You have created a pull request and from now on it depends on the maintainer of the main project to accept or reject it.