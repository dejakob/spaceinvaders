"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = function(ws, pingpong) {
    var me;
    var isScreen;
    var currentLevelId = 0;
    var Level = require(GLOBAL.rootpath + '/server/spacelogic/level.js')(ws);
    var twitterService = require('twitter');

        ws.on('AUTH', function(message) {
            var spacePlayer = SpaceLogic.getPlayerById(message.playerId);
            if (message.playerHash && message.playerHash === spacePlayer.hash) {
                me = spacePlayer;
                var procedureLocation = require(GLOBAL.rootpath + '/server/procedures/location.js');
                procedureLocation.removeByUserId(me.id);
                isScreen = message.screen;

                if (isScreen) {
                    SpaceLogic.updatePlayer(spacePlayer.id, 'onScreen', function(cb) {
                        cb(ws);
                    });
                    if (typeof me.onPhone !== 'undefined') {
                        me.onPhone(function(ws) {
                            ws.emit('SCREEN CONNECTED');
                        });
                    }
                    pingpong.addUser(ws, me);
                } else {
                    SpaceLogic.updatePlayer(spacePlayer.id, 'onPhone', function(cb) {
                        cb(ws);
                    });
                    if (typeof me.onScreen !== 'undefined') {

                        me.onScreen(function(ws) {

                            ws.emit('PHONE CONNECTED');

                            var spacePlayer = SpaceLogic.getPlayerById(message.playerId);
                            if (typeof spacePlayer.twitterAuthToken !== 'undefined' && typeof spacePlayer.twitterAuthSecret !== 'undefined') {


                                var Twitter = new twitterService({
                                    consumer_key: TWITTER_CONSUMER_KEY,
                                    consumer_secret: TWITTER_CONSUMER_SECRET,
                                    access_token_key: spacePlayer.twitterAuthToken,
                                    access_token_secret: spacePlayer.twitterAuthSecret
                                });

                                Twitter.get('/statuses/user_timeline', function(err, res) {

                                    if (!err) {
                                        res = res[0];

                                        SpaceLogic.updatePlayer(spacePlayer.id, 'twitterInfo', res);

                                        ws.emit('TWITTER ABOUT', {
                                            twitterInfo: {
                                                userName: res.user.screen_name,
                                                userId: res.user.id_str,
                                                image: res.user.profile_image_url.replace(/normal/gi, 'bigger')
                                            }
                                        });
                                    }

                                });
                            }

                        });
                    }
                }
            }
        });

        ws.on('OPEN LOCATION PLAYER', function(message) {
            if (typeof message === 'undefined') {
            } else {
                var procedureLocation = require(GLOBAL.rootpath + '/server/procedures/location.js');
                message.user = me;
                procedureLocation.addItem(message, function(bool) {});
            }
        });

        ws.on('START LEVEL', function(message) {
            Level.startLevel(currentLevelId, me);
            currentLevelId++;
        });

        ws.on('CONTROL', function(message) {
            if (me) {
                if (typeof me.onScreen !== 'undefined') {
                    me.onScreen(function(ws) {
                        try {
                            if (message.x < 0) {
                                ws.emit('MOVE SHIP LEFT');
                            } else if (message.x > 0) {
                                ws.emit('MOVE SHIP RIGHT');
                            } else {
                                ws.emit('PARK');
                            }

                        } catch (ex) {

                        }
                    });
                }
            }
        });

        ws.on('FIRE', function(message) {
            try {
                if (typeof me !== 'undefined' && typeof me.onScreen !== 'undefined') {
                    me.onScreen(function(ws) {
                        try {
                            ws.emit('FIRE');
                        } catch (ex) {

                        }
                    });
                }
            } catch (ex) {

            }
        });

        ws.on('LEVEL END SCREEN', function(message) {
            var procedureScore = require(GLOBAL.rootpath + '/server/procedures/scores.js');
            var score = message.score;
            SpaceLogic.updatePlayer(me.id, 'score', score);

            procedureScore.addItem(SpaceLogic.getPlayerById(me.id), score, function() {
                me.onPhone(function(ws) {
                    me.isLevelStarted = false;
                    ws.emit('LEVEL END SCREEN');
                });
            });
        });

        ws.on('DISCONNECT', function(msg) {
            SpaceLogic.removePlayer(me.id);
            ws.conn.close();
        });
};
