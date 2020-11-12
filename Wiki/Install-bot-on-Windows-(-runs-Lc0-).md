# Install bot on Windows ( runs Lc0 )

## Download and install git

https://git-scm.com/download/

## Download and install Node.js and npm

https://nodejs.org/en/download/

## Open a console ( terminal, command prompt ) window

If you don't know how to do this, Google it up. Here is a guide for Windows 10 https://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/ .

## Clone Hyper Bot, edit serve.bat and start the bot

In the console window type:

```
git clone https://github.com/hyperchessbot/hyperbot
cd hyperbot
npm install
```

Based on the path shown in the console window's prompt, find the downloaded repo in your file explorer and open `serve.bat` in a text editor or type `notepad serve.bat` in the console window, which will open it in notepad text editor.

Fill in your bot token and bot name in serve.bat and save the file.

Then in the same terminal type:

```
serve
```

In your browser visit http://localhost:3000. Your bot is now up and plays using Lc0.

## Configure your bot

Add the necessary config variables by editing `serve.bat`.

Each config var goes to a separate line, at the top of the file, in the form

```
set CONFIG_VAR_NAME=value
```

By default the only configuration apart from credentials is `USE_LC0=true` which makes your bot use the Lc0 engine and `ENGINE_MOVE_OVERHEAD=1000` so that your engine does not time out ( increase this if necessary ).

## Open bot home page

In your browser visit http://localhost:3000 .

## Download a net ( weights ) for Lc0

Download a net from https://github.com/LeelaChessZero/lc0/wiki/Best-Nets-for-Lc0 .

Rename the weights file `weights.pb.gz` and copy it to the `lc0goorm` folder of your cloned repository ( overwrite the old weights file ).