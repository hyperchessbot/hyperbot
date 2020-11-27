# Build book from external multi game PGN file

## Create a new repo using your GitHub account

In the top right corner push the + button

![](https://i.imgur.com/ResnUp9.png)

Give a name to your repo and add a short description. Add a readme to the repo by checking Add a README file

![](https://i.imgur.com/IIQEq1W.png)

Press Create repository.

## Upload a multi game PGN file

In the repo view click on Add file / Upload files

![](https://i.imgur.com/RICE8cM.png)

Drag the file into the Drag files here to add them to your repository box

![](https://i.imgur.com/duuHKEB.png)

Wait for the progress bar to complete file upload

![](https://i.imgur.com/CIpLsPb.png)

When the upload finishes and your file name appears among uploaded files, press Commit changes

![](https://i.imgur.com/BK0Cf6q.png)

## Open file in raw view

In the repo view click on the newly uploaded PGN file's name

![](https://i.imgur.com/19RFh8z.png)

Click on View raw

![](https://i.imgur.com/RIjQfLH.png)

## Copy file link

Copy the file link from your browser's address bar

![](https://i.imgur.com/uneFX1W.png)

## Set PGN_URL config var on Heroku

Create a new config var PGN_URL on Heroku and set it to the link you copied from your browser's address bar ( also provide your MONGODB_URI and set MONGO_VERSION to 2 )

**example url** : https://raw.githubusercontent.com/hyperchessbot/pgnrepo/main/2020-11.bare.%5B5159%5D.pgn

![](https://i.imgur.com/9qU20cB.png)

On application startup the MongoDb book builder will start building this multi game PGN file into your MongoDb book.