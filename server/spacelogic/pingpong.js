"use strict";

var procedureLocation = require(GLOBAL.rootpath + '/server/procedures/location.js');
var spaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = (function() {

    var _users = {};
    var _mobileUsers = {};

    var addUser = function(ws, me) {
        _users[me.id] = {
            'ws': ws,
            'me': me,
            'pings': 0
        };

        ws.on('PONG', function(msg) {
            _users[me.id].pings--;
        });
    };

    var addMobileUser = function(ws, me) {
        _mobileUsers[me.id] = {
            'ws': ws,
            'me': me,
            'pings': 0
        };

        ws.on('PONG', function(msg) {
            _mobileUsers[me.id].pings--;
        });
    };

    var removeUser = function(me) {
        if (typeof _users[me.id] !== 'undefined') {
            var ws = _users[me.id].ws;
            delete _users[me.id];
            procedureLocation.removeByUserId(me.id);
            spaceLogic.removePlayer(me.id);
            ws.conn.close();
        }
    };

    var removeMobileUser = function(me) {
        if (typeof _mobileUsers[me.id] !== 'undefined') {
            var ws = _mobileUsers[me.id].ws;
            delete _mobileUsers[me.id];
            try { spaceLogic.updatePlayer(me.id, 'isAuthenticated', false); } catch (ex) {/* Extra check to unauthenticate user (if not removed already) */}
            if (typeof _users[me.id] !== 'undefined') {
                var sws = _users[me.id].ws;
                sws.emit('PHONE DISCONNECTED');
            }
            ws.conn.close();
        }
    };

    var start = function() {

        var _interval = setInterval(function() {
            var keys = Object.keys(_users);
            var mobileKeys = Object.keys(_mobileUsers);
            var i = 0;
            var k;
            var v;

            for (i = 0; i < keys.length; i++) {
                k = keys[i];
                v = _users[k];

                if (typeof v !== 'undefined') {
                    if (v.pings < 2) {
                        v.pings++;
                        v.ws.emit('PING');
                    } else {
                        removeUser(v.me);
                    }
                }
            }

            for (i = 0; i < mobileKeys.length; i++) {
                k = mobileKeys[i];
                v = _mobileUsers[k];

                if (typeof v !== 'undefined') {
                    if (v.pings < 2) {
                        v.pings++;
                        v.ws.emit('PING');
                    } else {
                        removeMobileUser(v.me);
                    }
                }
            }

        }, 10 * 1000);

    };

    return {
        addUser: addUser,
        addMobileUser: addMobileUser,
        removeUser: removeUser,
        start: start
    }
})();