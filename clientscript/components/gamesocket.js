var GameSocket = (function() {
    var init = function(viewCallback) {
        var self = this;
        var BASE_URL = window.location.hostname;
        SpaceView.generateAuthUrl(function(params) {
            var url = 'http://' + window.location.host + '?playerId=' + params.playerId + '&playerHash' + params.playerHash;
            self.qrcode = url;

            var socket = new WebSocket('ws://' + BASE_URL + ':8889');
            var authenticate = function() {
                socket.send({
                    'action': "AUTH",
                    'playerId': params['playerId'],
                    'playerHash': params['playerHash'],
                    'screen': tru
                });
            };

            socket.onopen = function(event) {
                authenticate();

                socket.onmessage = function(ev) {
                    console.log('ONMESSAGE', ev);
                };
            };

        });
    };

    return {
        init: init
    }
})();