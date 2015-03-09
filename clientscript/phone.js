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
        //TODO CHANGE
        socket.send(JSON.stringify({
            'action': "START LEVEL"
        }));
    };

    var onLeft = function() {
        socket.send(JSON.stringify({
            'action': "CONTROL",
            'x': -10
        }));
    };

    var onRight = function() {
        socket.send(JSON.stringify({
            'action': "CONTROL",
            'x': +10
        }));
    };

    //TODO remove
    /*document.body.onclick = function() {
        onLeft();
    };*/

    socket.onopen = function(ev) {
        authenticate();
        RotateDevice.addBetaListener(function(x) {
            socket.send(JSON.stringify({
                'action': "CONTROL",
                'x': x
            }));
        });

        document.onkeydown = function(ev) {
            switch (ev.keyCode) {
                case 37:
                    onLeft();
                    break;
                case 39:
                    onRight();
                    break;
            }
        };

        socket.onmessage = function(ev) {
            console.log('ONMESSAGE', ev);
        };
    };

});