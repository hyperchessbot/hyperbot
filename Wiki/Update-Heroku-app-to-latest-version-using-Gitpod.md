# Update Heroku app to latest version using Gitpod

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