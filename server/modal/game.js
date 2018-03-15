const cuid = require('cuid');

function Game() {
    this.id = cuid();
    this.verificationCode = cuid();
}
Game.prototype.toJSON = function() {
    return JSON.stringify(this.toObject());
}
Game.prototype.toObject = function() {
    return {
        id: this.id,
        verificationCode: this.verificationCode
    };
}

module.exports = Game;