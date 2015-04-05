var moment = require('moment');

module.exports = {
    'getList': function(location, callback) {
        //TODO BLOCKING REMOVE AFTER CONNECT
        var latitudeMin;
        var latitudeMax;
        var longitudeMin;
        var longitudeMax;

        var self = this;

        if (typeof location !== 'undefined' && location !== null) {
            latitudeMin = Math.floor(location.latitude * 10000) / 10000;
            latitudeMax = Math.ceil(location.latitude * 10000) / 10000;
            longitudeMin = Math.floor(location.longitude * 10000) / 10000;
            longitudeMax = Math.ceil(location.longitude * 1000000) / 1000000;
        } else {
            latitudeMin = -90;
            latitudeMax = +90;
            longitudeMin = -180;
            longitudeMax = +180;
        }

        db.get('spaceinvaders', '_design/games/_view/by_location', {
            startkey: [latitudeMin, longitudeMin],
            endkey: [latitudeMax, longitudeMax],
            limit: 10
        }, function(err, results) {
            var items = [];
            if (!err) {
                //TODO BLOCKING
                if (results.data.rows) {
                    var rows = results.data.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var nearby = null;
                        try {
                            nearby = row.value.foursquare.response.venues[0].name;
                        } catch (ex) {}

                        if (row.value.datetime && row.value.datetime > moment().subtract(10, 'minutes').format('X')) {
                            items.push({
                                location: row.value.location,
                                user: row.value.user,
                                nearby: nearby
                            });
                        } /*else {
                            self.removeByUserId(row.value.user.id);
                        }*/

                    }
                    callback({servers: items});
                } else {
                    callback({servers: results.data});
                }
            } else {
                callback({items: items});
            }

        });

    },
    'addItem': function(data, callback) {

        var addFoursquareData = function(data) {
            var url = 'https://api.foursquare.com/v2/venues/search?v={foursquareDate}&limit=12&client_id={foursquareKey}&client_secret={foursquareSecret}&ll={latitude},{longitude}';
            url = url.replace('{foursquareDate}', GLOBAL.FOURSQUARE_DATE);
            url = url.replace('{foursquareKey}', GLOBAL.FOURSQUARE_KEY);
            url = url.replace('{foursquareSecret}', GLOBAL.FOURSQUARE_SECRET);
            url = url.replace('{latitude}', data.location.latitude);
            url = url.replace('{longitude}', data.location.longitude);
            var request = require('request');
            request.get(url, function (err, response, body) {
                body = JSON.parse(body);
                if (!err) {
                    data.foursquare = body;
                    data.datetime = moment().format('X');
                    db.update('spaceinvaders', data, function(err, res) {
                    });
                } else {
                }
            });

        };

        var insertScore = function(gameId) {
            data._id = gameId;
            data.type = 'game';

            db.insert('spaceinvaders', data, function(err, res) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                    data._rev = res.data.rev;
                    addFoursquareData(data);
                }
            });
        };

        var updateScore = function(gameId, _rev) {
            data._id = gameId;
            data._rev = _rev;
            data.type = 'game';


            db.update('spaceinvaders', data, function(err, res) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });

            addFoursquareData(data);
        };

        if (typeof data._id !== 'undefined') {
            db.get('spaceinvaders', data._id, function(err,res) {
                if (err) {
                    insertScore('GAME_' + data._id);
                } else {
                    updateScore('GAME_' + data._id, res.data._rev);
                }
            });
        } else {
            this.createNewId(function(ids) {
                if (ids && ids.length) {
                    insertScore('GAME_' + ids[0]);
                } else {
                    callback(false);
                }
            })
        }


    },
    'removeByUserId': function(userId) {
        db.get('spaceinvaders', '_design/games/_view/by_playerid', {
            startKey: [userId],
            endkey: [userId]
        }, function(err, result) {
            if (!err) {
                var rows = result.data.rows;
                if (rows.length)
                {
                    result = rows[0].value;
                    result.deleted = 1;
                    db.update('spaceinvaders', result, function(err, res) {
                    });
                }

            }
        });
    },
    'createNewId': function(callback) {
        db.uniqid(function (err, ids) {
            if (err) {
                callback(false);
            } else {
                callback(ids);
            }
        });
    }

};