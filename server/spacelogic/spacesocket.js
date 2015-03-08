"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = function(ws) {
    var me;
    var _isScreen;
    console.log('spacesocket');

    //on connection
    ws.on('message', function(message) {
        console.log('MESSAGE', message);

        switch (message.action) {
            case 'AUTH':
                console.log('AUTHING!')
                var spacePlayer = SpaceLogic.getPlayerById(message.playerId);
                if (message.playerHash && message.playerHash === spacePlayer.hash) {
                    me = spacePlayer;
                    _isScreen = message.screen;
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
};
