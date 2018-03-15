const redis = require("redis");
const redisClient = redis.createClient();

function getGame(gameId) {
    try {
        JSON.parse(redisClient.get(`game_${game.id}`));
    }
    catch (ex) {
        return null;
    }
}

function setGame(game) {
    redisClient.set(`game_${game.id}`, game.toJSON());
}

module.exports = {
    getGame,
    setGame
};