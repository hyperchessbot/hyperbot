module.exports = {
    streamBotGameUrl : gameId => `https://lichess.org/api/bot/game/stream/${gameId}`,
    makeBotMoveUrl : (gameId, bestmove) => `https://lichess.org/api/bot/game/${gameId}/move/${bestmove}`,
    acceptChallengeUrl : challengeId => `https://lichess.org/api/challenge/${challengeId}/accept`,
    streamEventsUrl : `https://lichess.org/api/stream/event`
}