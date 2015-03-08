"use strict";

module.exports = (function() {
    if (typeof GLOBAL.spacePlayerId === 'undefined') {
        GLOBAL.spacePlayerId = 0;
    }

    if (typeof GLOBAL.spacePlayers === 'undefined') {
        GLOBAL.spacePlayers = {};
    }

    return {
        addPlayer: function(spacePlayer) {
            GLOBAL.spacePlayers[spacePlayer.id] = spacePlayer;
        },
        removePlayer: function(spacePlayerId) {
            delete GLOBAL.spacePlayers[spacePlayerId];
        },
        getPlayerById: function(id) {
            if (typeof GLOBAL.spacePlayers[id] === 'undefined') {
                return false;
            }
            return GLOBAL.spacePlayers[id];
        },
        getNextPlayerId: function() {
            return ++GLOBAL.spacePlayerId;
        }
    };
})();