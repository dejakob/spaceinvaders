var GameSocket = function(scope, io) {
    var socket;

    var init = function(callbacks) {
        var BASE_URL = window.location.hostname;
        SpaceView.generateAuthUrl(function(params) {
            var url = 'http://' + window.location.host + '?playerId=' + params.playerId + '&playerHash=' + params.playerHash;
            scope.qrcode = url;

            socket = io('http://'+ BASE_URL + ':' + serverPort, {forceNew: true});

            var authenticate = function() {
                socket.emit('AUTH', {
                    'playerId': params['playerId'],
                    'playerHash': params['playerHash'],
                    'screen': true
                });
            };

            socket.on('connect', function() {
                authenticate();

                socket.on('PHONE CONNECTED', function(data) {
                    scope.qrcode = false;
                    callbacks.initView(data);
                });

                socket.on('TWITTER ABOUT', function(data) {
                    scope.twitterInfo = data.twitterInfo;
                });

                socket.on('MOVE SHIP LEFT', function() {
                    callbacks.onLeft();
                });

                socket.on('MOVE SHIP RIGHT', function() {
                    callbacks.onRight();
                });

                socket.on('PARK', function() {
                    callbacks.onPark();
                });

                socket.on('START LEVEL', function(data) {
                    callbacks.startLevel(data.levelId, data.speedX, data.speedY);
                });

                socket.on('ENEMY', function(data) {
                    callbacks.onEnemy(data.enemy);
                });

                socket.on('FIRE', function() {
                    callbacks.onFire();
                });

                socket.on('END LEVEL', function(data) {
                    callbacks.onPrepareEndLevel(data.isLastLevel);
                });
            });

        });
    };

    var send = function(data) {
        if (socket) {
            var action = data.action;
            delete data.action;
            socket.emit(action, data);
        }
    };

    return {
        init: init,
        send: send
    }
};