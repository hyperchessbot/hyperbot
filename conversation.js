<script language="JavaScript">

var nl = getNewLine()

function getNewLine() {
	var agent = navigator.userAgent

	if (agent.indexOf("Win") >= 0)
		return "\r\n"
	else
		if (agent.indexOf("Mac") >= 0)
			return "\r"

 	return "\r"

}

pagecode = 'from time import time'+nl+nl+
	'class Conversation():'+nl+
	'    def __init__(self, game, engine, xhr, version, challenge_queue):'+nl+
	'        self.game = game'+nl+
	'        self.engine = engine'+nl+
	'        self.xhr = xhr'+nl+
	'        self.version = version'+nl+
	'        self.challengers = challenge_queue'+nl+nl+
	'    command_prefix = "!"'+nl+nl+
	'    def react(self, line, game):'+nl+
	'        print("*** {} [{}] {}: {}".format(self.game.url(), line.room, line.username, line.text.encode("utf-8")))'+nl+
	'        if (line.text[0] == self.command_prefix):'+nl+
	'            self.command(line, game, line.text[1:].lower())'+nl+
	'        pass'+nl+nl+
	'    def command(self, line, game, cmd):'+nl+
	'        if cmd == "commands" or cmd == "help":'+nl+
	'            self.send_reply(line, "Supported commands: !name, !howto, !eval, !queue")'+nl+
	'        elif cmd == "wait" and game.is_abortable():'+nl+
	'            game.ping(60, 120)'+nl+
	'            self.send_reply(line, "Waiting 60 seconds...")'+nl+
	'        elif cmd == "name":'+nl+
	'            self.send_reply(line, "{} (hyperbot v{})".format(self.engine.name(), self.version))'+nl+
	'        elif cmd == "howto":'+nl+
	'            self.send_reply(line, "How to run your own bot: https://github.com/hyperchessbot/hyperbot")'+nl+
	'        elif cmd == "eval":'+nl+
	'            stats = self.engine.get_stats()'+nl+
	'            self.send_reply(line, ", ".join(stats))'+nl+
	'        elif cmd == "queue":'+nl+
	'            if self.challengers:'+nl+
	'                challengers = ", ".join(["@" + challenger.challenger_name for challenger in reversed(self.challengers)])'+nl+
	'                self.send_reply(line, "Challenge queue: {}".format(challengers))'+nl+
	'            else:'+nl+
	'                self.send_reply(line, "No challenges queued.")'+nl+nl+
	'    def send_reply(self, line, reply):'+nl+
	'        self.xhr.chat(self.game.id, line.room, reply)'+nl+nl+nl+
	'class ChatLine():'+nl+
	'    def __init__(self, json):'+nl+
	'        self.room = json.get("room")'+nl+
	'        self.username = json.get("username")'+nl+
	'        self.text = json.get("text")'

document.write(pagecode);

</script>