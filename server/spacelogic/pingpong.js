"use strict";

var procedureLocation = require(GLOBAL.rootpath + '/server/procedures/location.js');
var spaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');

module.exports = (function() {

    var _users = {};

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

    var removeUser = function(me) {
        if (typeof _users[me.id] !== 'undefined') {
            var ws = _users[me.id].ws;
            delete _users[me.id];
            procedureLocation.removeByUserId(me.id);
            spaceLogic.removePlayer(me.id);
            ws.conn.close();
        }
    };

    var start = function() {

        var _interval = setInterval(function() {
            var keys = Object.keys(_users);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var v = _users[k];

                if (typeof v !== 'undefined') {
                    if (v.pings < 2) {
                        v.pings++;
                        v.ws.emit('PING');
                    } else {
                        removeUser(v.me);
                    }
                }
            }
        }, 10 * 1000);

    };

    return {
        addUser: addUser,
        removeUser: removeUser,
        start: start
    }
})();