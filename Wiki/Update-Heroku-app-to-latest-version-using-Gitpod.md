# Update Heroku app to latest version using Gitpod

## Enabling syzygy tablebases

If you want to use 3-4-5 piece tablebases, you have to enable container build. If not, skip this section.

### Installing Heroku CLI

https://devcenter.heroku.com/articles/heroku-cli#download-and-install

### Setting stack to container

Open a console ( terminal / command prompt ) window ( if you don't know how to do this on your system, find your way based on a search like this https://www.google.com/search?q=open+terminal+command+prompt+window ).

Open a browser window with your app's Heroku login. This should be the active window when you do the following.

In the console type

```
heroku login
```

In the browser popup enable login.

When you are logged into Heroku CLI, in the console type ( change "yourappname" to the actual name of your app )

```
heroku stack:set container --app yourappname
```

![](https://i.imgur.com/vWROnFj.png)

## Opening upstream repo in Gitpod

Visit your forked repo, then press the Gitpod button..

![](https://i.imgur.com/MEvgqK6.png)

If you don't have the Gitpod button, prefix the link of the forked repo with `https://gitpod.io/#` and visit the resulting link.

In the top right corner click on your account login and from the menu select Open Access Control. Enable "write public repos".

![](https://i.imgur.com/5fbBCKZ.jpg)

Use the terminal to type in commands:

![](https://i.imgur.com/mawGHk7.png)

## Switch to master branch

In the Gitpod terminal type:

```
git checkout master
```

## Pull changes from upstream

In the Gitpod terminal type:

```
git fetch upstream master
git reset --hard upstream/master
```

## Push changes to your repo

In the Gitpod terminal type:

```
git push --force
```

If you enabled automatic deploys on Heroku, this will update your app to the latest version. If not, open your app's Heroku dashboard and press Deploy Branch in the Deploy tab.