"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = function(ws) {
    var me;
    var isScreen;
    console.log('spacesocket');

    //on connection
    ws.on('message', function(message) {
        console.log('MESSAGE', message);
        message = JSON.parse(message.toString());

        switch (message.action) {
            case 'AUTH':
                var spacePlayer = SpaceLogic.getPlayerById(message.playerId);
                if (message.playerHash && message.playerHash === spacePlayer.hash) {
                    me = spacePlayer;
                    isScreen = message.screen;

                    if (isScreen) {
                        SpaceLogic.updatePlayer(spacePlayer.id, 'onScreen', function(cb) {
                           cb(ws);
                        });
                        if (typeof me.onPhone !== 'undefined') {
                            me.onPhone(function(ws) {
                                ws.send(JSON.stringify({
                                    action: 'SCREEN CONNECTED'
                                }));
                            });
                        }
                    } else {
                        SpaceLogic.updatePlayer(spacePlayer.id, 'onPhone', function(cb) {
                            cb(ws);
                        });
                        if (typeof me.onScreen !== 'undefined') {
                            me.onScreen(function(ws) {
                                ws.send(JSON.stringify({
                                    action: 'PHONE CONNECTED'
                                }));
                            });
                        }
                    }
                }

                break;
            case 'CONTROL':
                if (me) {
                    if (typeof me.onScreen !== 'undefined') {
                        me.onScreen(function(ws) {
                            ws.send(JSON.stringify({
                                action: (message.x < 0) ? 'MOVE SHIP LEFT' : 'MOVE SHIP RIGHT'
                            }));
                        });
                    }
                }
                break;
        }
    });
    //ws.send('something');
};
