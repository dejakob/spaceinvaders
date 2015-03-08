var GameSocket = (function() {
    var init = function(scope, callbacks) {
        var BASE_URL = window.location.hostname;
        SpaceView.generateAuthUrl(function(params) {
            console.log('PARAMS', params);
            var url = 'http://' + window.location.host + '?playerId=' + params.playerId + '&playerHash=' + params.playerHash;
            scope.qrcode = url;

            var socket = new WebSocket('ws://' + BASE_URL + ':8889');
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

                    switch (data.action) {
                        case 'PHONE CONNECTED':
                            scope.qrcode = false;
                            callbacks.initView();
                            break;
                        case 'MOVE SHIP LEFT':
                            callbacks.onLeft();
                            break;
                        case 'MOVE SHIP RIGHT':
                            callbacks.onRight();
                            break;
                    }
                };
            };

        });
    };

    return {
        init: init
    }
})();