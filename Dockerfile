FROM hyperbotauthor/chessbaseimage:latest

COPY . .

RUN bash Dockerfile.sh

CMD ["bash", "startserver.sh"]
