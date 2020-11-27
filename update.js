const fs = require('fs')

const expl = {
	".git": "contains git repo information",
	".gitignore": "tells which files to ignore when pushing to git",
	".gitpod.Dockerfile" : "Dockerfile for opening the repo in Gitpod",
	".gitpod.yml" : "config file for opening the repo in Gitpod",
	"Dockerfile" : "container build manifest",
	"Dockerfile.sh" : "container build script",
	"LICENSE" : "license for the project ( MIT )",
	"Procfile" : "Heroku Procfile, tells the process type ( web ) and how to run the app",
	"README.md" : "ReadMe of the project",
	"Wiki" : "stores Wiki pages",
	"elo-3300.bin" : "CCRL ELO 3300 polyglot book",
	"favicon.ico" : "favicon of the app",	
	"heroku.yml" : "Heroku container build manifest",
	"latest.bat" : "script for updating to latest version ( Windows )",
	"latest.sh" : "script for updating to latest version ( Linux )",
	"lc0deps.sh" : "script for installing Lc0 dependencies",
	"lc0goorm" : "contains Lc0 code and weights",
	"libopenblas.dll" : "file necessary for running Lc0 on Windows",
	"mbooks.js" : "builds self learning MongoDb book ( mongo version 1 )",
	"mbooks2.js" : "builds self learning + external pgn MongoDb book ( mongo version 2 )",
	"node_modules" : "Node.js dependencies of the app",
	"package-lock.json" : "necessary for reproducible build",
	"package.json" : "lists Node.js dependencies to install for the app",	
	"serve.bat" : "bot start script for Windows",
	"serve.sh" : "bot start script for goorm ( Linux )",
	"server.js" : "entry point and code of app",
	"startserver.sh" : "script for starting the server on Heroku",
	"stockfish12" : "Stockfish 12 Linux",
	"stockfish12.exe" : "Stockfish 12 Windows",
	"stockfish12m" : "multi variant Stockfish 12 Linux",
	"stockfish12m.exe" : "multi variant Stockfish 12 Windows",
	"update.js" : "script for updating file information",
	"update.sh" : "script for updating Wiki",
	"yarn.lock" : "yarn lock file for reproducible build"
}

function intSize(size){
	if(size < 10000){
		return `${size} bytes`
	}
	if(size < 10000000){
		return `${Math.floor(size/1000)} kilo byte(s)`
	}
	if(size < 10000000000){
		return `${Math.floor(size/1000000)} mega byte(s)`
	}
	return `${Math.floor(size/1000000000)} giga byte(s)`
}

fs.writeFileSync("Wiki/explainfiles.md", fs.readdirSync(".").map(
	file => {		
		const entry = fs.lstatSync(file)		
		let kind = entry.isDirectory() ? `directory` : `file of size ${intSize(entry.size)}`
		return `# ${file}\n${kind}\n\n### ${expl[file]}\n\n`
	}
).join("\n"))