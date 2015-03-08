require([
    "core/rotatedevice.js"
], function() {
    var BASE_URL = window.location.hostname;
    var urlQuery = {};
    var splitter = window.location.href.split('?')[1].split('&');
    for(var i = 0; i < splitter.length; i++) {
        console.log('>>', splitter[i].split('=')[0], splitter[i].split('=')[1]);
        urlQuery[splitter[i].split('=')[0]] = splitter[i].split('=')[1];
    }
    var socket = new WebSocket('ws://' + BASE_URL + ':8889');

    //TODO on click start
    var authenticate = function() {
        console.log('to SEND',urlQuery);
        socket.send(JSON.stringify({
            'action': "AUTH",
            'playerId': urlQuery['playerId'],
            'playerHash': urlQuery['playerHash']
        }));
    };

    socket.onopen = function(ev) {
        authenticate();

        socket.onmessage = function(ev) {
            console.log('ONMESSAGE', ev);
        };
    };

});