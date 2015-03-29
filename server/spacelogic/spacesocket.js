"use strict";

var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = function(ws) {
    var me;
    var isScreen;
    var currentLevelId = 0;
    var Level = require(GLOBAL.rootpath + '/server/spacelogic/level.js')(ws);
    var twitterService = require('twitter');

    //on connection
    ws.on('message', function(message) {
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

                                            ws.send(JSON.stringify({
                                                action: 'TWITTER ABOUT',
                                                twitterInfo: {
                                                    userName: res.user.screen_name,
                                                    userId: res.user.id_str,
                                                    image: res.user.profile_image_url.replace(/normal/gi, 'bigger')
                                                }
                                            }));
                                        }

                                    });
                                }

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
                var procedureScore = require(GLOBAL.rootpath + '/server/procedures/scores.js');
                var score = message.score;
                SpaceLogic.updatePlayer(me.id, 'score', score);

                procedureScore.addItem(SpaceLogic.getPlayerById(me.id), score, function() {
                    me.onPhone(function(ws) {
                        me.isLevelStarted = false;
                        ws.send(JSON.stringify({
                            action: 'LEVEL END SCREEN'
                        }));
                    });
                });

                break;
        }
    });
    //ws.send('something');
};
