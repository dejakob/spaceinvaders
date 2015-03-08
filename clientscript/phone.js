require([
    "core/rotatedevice.js"
], function() {
    var BASE_URL = window.location.hostname;
    var urlQuery = {};
    var splitter = window.location.href.split('?')[1];
    for(var i = 0; i < splitter.length; i++) {
        urlQuery[splitter[i].split('=')[0]] = splitter[i].split('=')[1];
    }
    var socket = new WebSocket('ws://' + BASE_URL + ':8889');

    //TODO on click start
    var authenticate = function() {
        socket.send({
            'action': "AUTH",
            'playerId': urlQuery['playerId'],
            'playerHash': urlQuery['playerHash']
        });
    };

    authenticate();
});