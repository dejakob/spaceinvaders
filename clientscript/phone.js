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
    var movement = 'PARK';

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
        if (movement !== 'LEFT') {
            socket.send(JSON.stringify({
                'action': "CONTROL",
                'x': -10
            }));
            movement = 'LEFT';
        }
    };

    var onRight = function() {
        if (movement !== 'RIGHT') {
            socket.send(JSON.stringify({
                'action': "CONTROL",
                'x': +10
            }));
            movement = 'RIGHT';
        }
    };

    var onPark = function() {
        if (movement !== 'PARK') {
            socket.send(JSON.stringify({
                'action': "CONTROL",
                'x': 0
            }));
            movement = 'PARK';
        }
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
                if (direction > 1500) {
                    //Just to make sure, do it twice
                    onRight();
                    onRight();
                } else if (direction < -1500) {
                    onLeft();
                    onLeft();
                } else {
                    onPark();
                    onPark();
                }
            }

        });

        //Test madness
        document.onkeydown = function(ev) {
            switch (ev.keyCode) {
                case 37:
                    onLeft();
                    break;
                case 38:
                    onPark();
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
                    var i = 10;
                    var interval = setInterval(function() {
                        if (i === 0) {
                            clearInterval(interval);
                            actionButton.innerHTML = 'START';
                            action = 'START';
                        } else {
                            actionButton.innerHTML = i;
                        }
                        i--;
                    }, 1000);
                    break;
            }
        };
    };

});