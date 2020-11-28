from time import time

class Conversation():
    def __init__(self, game, engine, xhr, version, challenge_queue):
        self.game = game
        self.engine = engine
        self.xhr = xhr
        self.version = version
        self.challengers = challenge_queue

    command_prefix = "!"

    def react(self, line, game):
        print("*** {} [{}] {}: {}".format(self.game.url(), line.room, line.username, line.text.encode("utf-8")))
        if (line.text[0] == self.command_prefix):
            self.command(line, game, line.text[1:].lower())
        pass

    def command(self, line, game, cmd):
        if cmd == "commands" or cmd == "help":
            self.send_reply(line, "Supported commands: !name, !whoareyou,  !jokes ,!eval, !queue")
        elif cmd == "wait" and game.is_abortable():
            game.ping(60, 120)
            self.send_reply(line, "Waiting 60 seconds before cancelling the game...")
        elif cmd == "name":
            self.send_reply(line, "{} (lichess-bot v{})".format(self.engine.name(), self.version))
        elif cmd == "whoareyou":
            self.send_reply(line, "I Am AOOP09, Who Knows Coding And Making Jokes xD Also i am a big forum writer. Please join my team lichess.org/team/chess-tornado ")
        elif cmd == "jokes":
            self.send_reply(line, "Potatoes Gonna Potate")
        elif cmd == "eval" and line.room == "spectator":
            stats = self.engine.get_stats()
            self.send_reply(line, ", ".join(stats))
        elif cmd == "eval":
            self.send_reply(line, "I don't tell that to my opponent, sorry.Because...It isprivate LOL ")
        elif cmd == "queue":
            if self.challengers:
                challengers = ", ".join(["@" + challenger.challenger_name for challenger in reversed(self.challengers)])
                self.send_reply(line, "Challenge queue: {}".format(challengers))
            else:
                self.send_reply(line, "No challanges queued,Now I Can Concentrate.")

    def send_reply(self, line, reply):
        self.xhr.chat(self.game.id, line.room, reply)


class ChatLine():
    def __init__(self, json):
        self.room = json.get("room")
        self.username = json.get("username")
        self.text = json.get("text")
