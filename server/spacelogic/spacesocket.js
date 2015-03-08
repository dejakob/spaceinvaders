"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');
var me;
//on connection
ws.on('message', function(message) {
    switch (message.action) {
        case 'AUTH':
            var spacePlayer = SpaceLogic.getPlayerById(message.playerId);
            if (message.playerHash && message.playerHash === spacePlayer.hash) {
                me = spacePlayer;
            }
            ws.send({
               'action': 'AUTHRESPONSE',
               'data': spacePlayer
            });
            
            break;
        case 'CONTROL':

            break;
    }
});
//ws.send('something');