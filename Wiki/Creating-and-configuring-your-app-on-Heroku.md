# Creating and configuring your app on Heroku

## Create app

Log in to your Heroku account and visit https://dashboard.heroku.com/apps .

From "New" menu select "Create new app".

![](https://i.imgur.com/V6NgJHy.png)

Enter a name for your app ( this name has to be unique, if the name you type in is shown to be not available, modify it, until it is shown to be available ).

In "Choose region" select Europe ( this is necessary so that your server is close to lichess server in Paris ).

When everything is set, press "Create app".

![](https://i.imgur.com/FJEN0k7.png)

## Configure deploy

Upon creating your app, you will be taken to the Deploy tab. Click on Deploy if you are not already in this tab.

Click "GitHub" to link your GitHub account.

![](https://i.imgur.com/rwnYvDt.png)

Press "Search" to list all your repositories. Find your forked repo among the listed, and to select it for deployment, press "Connect".

![](https://i.imgur.com/7YprEuJ.png)

You should select the branch that has to be deployed, which is the "master" branch. Currently the app has only one branch "master", so the "master" branch is selected by default.

Press "Enable Automatic Deploys" so that your app is updated when you push changes to your repo.

In order to deploy your app for the first time press "Deploy branch".

![](https://i.imgur.com/iND4vNt.png)

Wait for the build to finish. After successful build click on "View" to view your app.

![](https://i.imgur.com/GEqnQ3T.png)

## Open app

You can open your app using the "Open app" button in the top right of your dashboard.

![](https://i.imgur.com/rdtjdRH.png)

## Configure app

In the "Settings" tab click on "Reveal config vars".

![](https://i.imgur.com/SMCKLDD.png)

For "KEY" enter "TOKEN", for value enter your lichess access token. Then press "Add".

![](https://i.imgur.com/frgJILp.png)

Create an other config var.

For "KEY" enter "BOT_NAME", for value enter your bot's lichess user name. Then press "Add".

![](https://i.imgur.com/fJA2oB0.png)

After everything was done your config should look like this ( used "xxx" for a mock token, but in reality this should be your actual lichess access token ):

![](https://i.imgur.com/X8pjxQU.png)

Your bot should be up and running now.