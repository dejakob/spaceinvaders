var GameSocket = function(scope) {
    var socket;

    var init = function(callbacks) {
        var BASE_URL = window.location.hostname;
        SpaceView.generateAuthUrl(function(params) {
            var url = 'http://' + window.location.host + '?playerId=' + params.playerId + '&playerHash=' + params.playerHash;
            scope.qrcode = url;

            socket = new WebSocket('ws://' + BASE_URL + ':8004');
            var authenticate = function() {
                socket.send(JSON.stringify({
                    'action': "AUTH",
                    'playerId': params['playerId'],
                    'playerHash': params['playerHash'],
                    'screen': true
                }));
            };

            socket.onopen = function(event) {
                authenticate();

                socket.onmessage = function(ev) {
                    var timestamp = ev.timestamp;
                    var data = JSON.parse(ev.data);

                    console.log('DATA ACTION', data.action);
                    switch (data.action) {
                        case 'PHONE CONNECTED':
                            scope.qrcode = false;
                            callbacks.initView(data);
                            break;
                        case 'TWITTER ABOUT':
                            scope.twitterInfo = data.twitterInfo;
                            break;
                        case 'MOVE SHIP LEFT':
                            callbacks.onLeft();
                            break;
                        case 'MOVE SHIP RIGHT':
                            callbacks.onRight();
                            break;
                        case 'PARK':
                            callbacks.onPark();
                            break;
                        case 'START LEVEL':
                            console.log('INCOMING: START LEVEL');
                            callbacks.startLevel(data.levelId, data.speedX, data.speedY);
                            break;
                        case 'ENEMY':
                            callbacks.onEnemy(data.enemy);
                            break;
                        case 'FIRE':
                            callbacks.onFire();
                            break;
                        case 'END LEVEL':
                            callbacks.onPrepareEndLevel();
                            break;
                    }
                };
            };

        });
    };

    var send = function(data) {
        if (socket) {
            socket.send(JSON.stringify(data));
            console.log("SENT", data);
        }
    };

    return {
        init: init,
        send: send
    }
};