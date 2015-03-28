module.exports = function() {
    var request = this.request;
    var response = this.response;

    var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');
    var SpacePlayer = require(GLOBAL.rootpath + '/server/spacelogic/spaceplayer.js');

    var create = function(callback) {
        var md5 = require('MD5');

        var player = new SpacePlayer();
        player.id = SpaceLogic.getNextPlayerId();
        player.name = request.query.name;
        player.hash = md5('SPACE' + Math.random() * 9999999);


        SpaceLogic.addPlayer(player);
        callback({player: player});
    };

    return {
        create: create
    }
};