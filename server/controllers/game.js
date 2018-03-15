const Game = require('../modal/game');
const GamePool = require('../services/game-pool');

function createGame(request, response) {
    const game = new Game();

    GamePool.setGame(game);

    response
        .status(200)
        .json({ game: game.toObject() });
}

function getGame(request, response) {
    const game = GamePool.getGame(request.params.id);

    response
        .status(200)
        .json({ game });
}

module.exports = {
    createGame,
    getGame
}