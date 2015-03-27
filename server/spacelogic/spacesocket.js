"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = function(ws) {
    var me;
    var isScreen;
    var currentLevelId = 0;
    var Level = require(GLOBAL.rootpath + '/server/spacelogic/level.js')(ws);

    console.log('LEVELLEVEL', Level);
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
            case 'START LEVEL':
                Level.startLevel(currentLevelId, me);
                currentLevelId++;
                break;
            case 'CONTROL':
                if (me) {
                    if (typeof me.onScreen !== 'undefined') {
                        me.onScreen(function(ws) {
                            try {
                                if (message.x < 0) {
                                    ws.send(JSON.stringify({
                                        action: 'MOVE SHIP LEFT'
                                    }));
                                } else if (message.x > 0) {
                                    ws.send(JSON.stringify({
                                        action: 'MOVE SHIP RIGHT'
                                    }));
                                } else {
                                    ws.send(JSON.stringify({
                                        action: 'PARK'
                                    }));
                                }

                            } catch (ex) {

                            }
                        });
                    }
                }
                break;
            case 'FIRE':
                try {
                    if (typeof me !== 'undefined' && typeof me.onScreen !== 'undefined') {
                        me.onScreen(function(ws) {
                            try {
                                console.log('SENDING FIRE', me);
                                ws.send(JSON.stringify({
                                    action: 'FIRE'
                                }));
                            } catch (ex) {

                            }
                        });
                    }
                } catch (ex) {

                }
                break;
            case 'LEVEL END SCREEN':
                console.log('>>>>>>>>> LEVEL END SCREEN');
                me.onPhone(function(ws) {
                    me.isLevelStarted = false;
                    ws.send(JSON.stringify({
                        action: 'LEVEL END SCREEN'
                    }));
                });
                break;
        }
    });
    //ws.send('something');
};
