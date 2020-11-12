# Install bot on goorm.io ( runs Lc0 )

## Sign up to goorm.io

Visit https://www.goorm.io/ and press Sign up.

## Create a Node.js container

Visit https://ide.goorm.io/my, and click on Create new container.

Fill in "Nodejs" for both Name and Description.

From the stack options select Node.js.

Press the Create (Ctrl + M) button.

When your container is ready, press Run container.

From now on you will work in the terminal of this container.

![](https://i.imgur.com/hW8JcyR.png)

To paste text into the terminal, right click over the terminal and select Paste from the context menu.

## Clone repository

```
git clone https://github.com/hyperchessbot/hyperbot
cd hyperbot
```

## Update Node.js version

```
npm cache clean -f
npm install -g n
n latest
```

**Close the container and run it again** so that your new Node.js version becomes default ( to close the container, from the top right context menu showing your login, choose Close Container ).

After running the terminal always switch to the hyperbot folder:

```
cd hyperbot
```

## Install dependencies

```
npm install
```

## Install Lc0 dependencies

```
bash lc0deps.sh
```

Wait patiently, this may take some time to complete.

## Edit serve.sh

```
goorm serve.sh
```

This will open serve.sh in a text editor.

![](https://i.imgur.com/en06fJn.png)

Edit the file with your bot's credentials, then save it with File / Save or Ctrl + S.

![](https://i.imgur.com/QWEtshk.png)

## Start bot

```
./serve.sh
```

or

```
bash serve.sh
```

## Configure your bot

To configure your bot, edit `serve.sh` and for every config var enter a new line at the top of the document, but below the first `#!/bin/bash` line, in the form

```
export CONFIG_VAR_NAME=value
```

By default the only configuration apart from credentials is `USE_LC0=true` which makes your bot use the Lc0 engine and `ENGINE_MOVE_OVERHEAD=1000` so that your engine does not time out ( increase this if necessary ).

## Open bot home page

Go to PROJECT / Running URL and Port.

There should be a default Registered URL and Port pointing to Port 3000.

Click on the open window icon of this url ( button right to the url ).

![](https://i.imgur.com/6emvf27.png)

If your bot is not running, this window may show Connection Refused. In this case run your bot and refresh the window.

## Download a net ( weights ) for Lc0

Download a net from https://github.com/LeelaChessZero/lc0/wiki/Best-Nets-for-Lc0 .

Rename the weights file `weights.pb.gz` and copy it to the `lc0goorm` folder of your cloned repository ( overwrite the old weights file ).