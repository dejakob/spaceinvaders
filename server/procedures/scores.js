module.exports = {
    'getList': function(callback) {
        db.get('spaceinvaders', '_design/highscores/_view/by_score', {
            descending: true
        }, function(err, results) {
            var items = [];
            if (!err) {
                //TODO BLOCKING
                if (results.data.rows) {
                    var rows = results.data.rows;
                    var filter = [];
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (typeof row.value.twitterInfo !== 'undefined') {
                            if (filter.indexOf(row.value.twitterInfo.user.id_str) < 0) {
                                var item = {
                                    'score': row.value.score,
                                    'user': {
                                        'screen_name': row.value.twitterInfo.user.screen_name,
                                        'profile_image_url': row.value.twitterInfo.user.profile_image_url.replace(/normal/gi, 'bigger'),
                                        'url': row.value.twitterInfo.user.url,
                                        'profile_background_image_url': row.value.twitterInfo.user.profile_background_image_url
                                    }
                                };
                                filter.push(row.value.twitterInfo.user.id_str);
                                items.push(item);
                            }
                            if (items.length >= 50) {
                                break;
                            }
                        }
                    }
                    callback({items: items});
                } else {
                    callback({items: results.data});
                }
            } else {
                callback({items: items});
            }

        });
    },
    'addItem': function(spacePlayer, score, callback) {
        var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

        var insertScore = function(scoreId) {
            spacePlayer.score = score;
            spacePlayer._id = scoreId;
            spacePlayer.type = 'score';

            db.insert('spaceinvaders', spacePlayer, function(err, res) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        };

        var updateScore = function(scoreId, _rev) {
            spacePlayer.score = score;
            spacePlayer._id = scoreId;
            spacePlayer._rev = _rev;
            spacePlayer.type = 'score';


            db.update('spaceinvaders', spacePlayer, function(err, res) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        };

        if (typeof spacePlayer.scoreId !== 'undefined') {
            db.get('spaceinvaders', 'SCORE_' + spacePlayer.scoreId, function(err,res) {
                if (err) {
                    insertScore('SCORE_' + spacePlayer.scoreId);
                } else {
                    updateScore('SCORE_' + spacePlayer.scoreId, res.data._rev);
                }
            });
        } else {
            this.createNewId(function(ids) {
                if (ids && ids.length) {
                    insertScore('SCORE_' + ids[0]);
                    SpaceLogic.updatePlayer(spacePlayer.id, 'scoreId', ids[0]);
                } else {
                    callback(false);
                }
            })
        }


    },
    'createNewId': function(callback) {
        db.uniqid(function (err, ids) { // or even simplier: couch.uniqid(function (err, ids) {
            if (err) {
                callback(false);
            } else {
                callback(ids);
            }
        });
    }

};