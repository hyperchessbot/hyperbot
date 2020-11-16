FROM hyperbotauthor/chessbaseimage:latest

COPY . .

RUN bash Dockerfile.sh

CMD ["node", "server.js"]

