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
    var socket = new WebSocket('ws://' + BASE_URL + ':8004');
    var action = 'START';
    var actionButton = document.querySelector('#shoot');
    var isAuthenticated = false;
    var fireJson = JSON.stringify({'action': "FIRE"});

    //TODO on click start
    var authenticate = function() {
        console.log('to SEND',urlQuery);
        socket.send(JSON.stringify({
            'action': "AUTH",
            'playerId': urlQuery['playerId'],
            'playerHash': urlQuery['playerHash']
        }));
        isAuthenticated = true;
        //TODO CHANGE
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

    var onSubmit = function() {
        if (action === 'START') {
            if (!isAuthenticated) {
                authenticate();
            }
            actionButton.innerHTML = 'FIRE';
            action = 'FIRE';
            socket.send(JSON.stringify({
                'action': "START LEVEL"
            }));
        } else {
            socket.send(fireJson);
        }
    };

    //TODO remove
    /*document.body.onclick = function() {
        onLeft();
    };*/

    socket.onopen = function(ev) {
        var direction = 0;

        RotateDevice.addBetaListener(function(x) {

            if (isAuthenticated) {
                direction = parseInt(x*100);
                if (direction > 0) {
                    onRight();
                } else if (direction < 0) {
                    onLeft();
                }
            }

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

        if (actionButton.ontouchstart) {
            actionButton.ontouchstart = onSubmit;
        } else {
            actionButton.onclick = onSubmit;
        }

        socket.onmessage = function(ev) {
            console.log('ONMESSAGE', ev);
            var data = JSON.parse(ev.data);

            switch (data.action) {
                case 'LEVEL END SCREEN':
                    actionButton.innerHTML = 'START';
                    action = 'START';
                    break;
            }
        };
    };

});