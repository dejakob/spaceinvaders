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

    var getByLocation = function(callback) {
        //TODO BLOCKING filter non-actives out of the db
        var locationProcedure = require(GLOBAL.rootpath + '/server/procedures/location.js');
        if (request.query.latitude === 'undefined' || request.query.longitude === 'undefined') {
            callback(false);
        } else {
            locationProcedure.getList({
                latitude: parseFloat(request.query.latitude),
                longitude: parseFloat(request.query.longitude)
            }, function(results) {
               callback(results);
            });
        }

    };

    return {
        create: create,
        getByLocation: getByLocation
    }
};