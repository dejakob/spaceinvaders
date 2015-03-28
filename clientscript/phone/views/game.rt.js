define(['lib/react.js', 'phone/views/game.rt.rt', 'core/rotatedevice.js'], function (React, template) {
    'use strict';

    return React.createClass({
        render: template,
        displayName: 'GameView',
        status: 'START',
        componentDidMount: function() {
            var scope = this;
            var BASE_URL = window.location.hostname;
            var screenWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
            var socket;
            var statusEl = document.getElementById('status');

            //TODO BLOCKING
            statusEl.setAttribute('style', 'line-height: ' + screenWidth + 'px;');

            WebSocket.prototype.sendJSON = function(obj) {
                this.send(JSON.stringify(obj));
            };

            var EnumMovement = {
                'MOVEMENT_PARK': 'PARK',
                'MOVEMENT_LEFT': 'LEFT',
                'MOVEMENT_RIGHT': 'RIGHT'
            };

            var EnumAction = {
                'ACTION_AUTH': 'AUTH',
                'ACTION_START': 'START LEVEL',
                'ACTION_FIRE': 'FIRE',
                'ACTION_CONTROL': 'CONTROL'
            };

            var EnumStatus = {
                'STATUS_START': 'START',
                'STATUS_FIRE': 'FIRE'
            };

            var Game = {
                isAuthenticated: false,
                Controller: {
                    movement: EnumMovement.MOVEMENT_PARK
                },
                trigger: function(key) {
                    var _triggers = {
                        authenticate: function() {
                            require(['phone/helpers/url.js'], function(UrlHelper) {
                                var urlQuery = UrlHelper.getQuery();

                                socket.sendJSON({
                                    'action': EnumAction.ACTION_AUTH,
                                    'playerId': urlQuery['playerId'],
                                    'playerHash': urlQuery['playerHash']
                                });

                                Game.isAuthenticated = true;
                            });
                        },
                        onLeft: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_LEFT) {
                                socket.sendJSON({
                                    'action': EnumAction.ACTION_CONTROL,
                                    'x': -10
                                });
                                Game.Controller.movement = EnumMovement.MOVEMENT_LEFT;
                            }
                        },
                        onRight: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_RIGHT) {
                                socket.sendJSON({
                                    'action': EnumAction.ACTION_CONTROL,
                                    'x': +10
                                });
                                Game.Controller.movement = EnumMovement.MOVEMENT_RIGHT;
                            }
                        },
                        onPark: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_PARK) {
                                socket.sendJSON({
                                    'action': EnumAction.ACTION_CONTROL,
                                    'x': 0
                                });
                                Game.Controller.movement = EnumMovement.MOVEMENT_PARK;
                            }
                        },
                        onStart: function() {
                            if (!Game.isAuthenticated) {
                                Game.trigger('authenticate');
                            }
                            scope.status = EnumStatus.STATUS_FIRE;
                            statusEl.innerHTML = scope.status;
                            scope.render();
                            socket.sendJSON({
                               'action': EnumAction.ACTION_START
                            });
                        },
                        onFire: function() {
                            if (Game.isAuthenticated) {
                                socket.sendJSON({
                                    'action': EnumAction.ACTION_FIRE
                                });
                            }
                        }
                    };

                    console.log('TRIGGER', key);
                    if (typeof _triggers[key] !== 'undefined') {
                        _triggers[key]();
                    }
                },
                init: function() {
                    socket = new WebSocket('ws://' + BASE_URL + ':8004');
                    socket.onopen = function() {

                        RotateDevice.addBetaListener(function(x) {
                            var direction;

                            if (Game.isAuthenticated) {
                                direction = parseInt(x*100);
                                if (direction > 1500) {
                                    Game.trigger('onRight');
                                } else if (direction < -1500) {
                                    Game.trigger('onLeft');
                                } else {
                                    Game.trigger('onPark');
                                }
                            }

                        });

                        //For develop purposes
                        document.onkeydown = function(ev) {
                            switch (ev.keyCode) {
                                case 37:
                                    Game.trigger('onLeft');
                                    break;
                                case 38:
                                    Game.trigger('onPark');
                                    break;
                                case 39:
                                    Game.trigger('onRight');
                                    break;
                            }
                        };

                        socket.onmessage = function(ev) {
                            var data = JSON.parse(ev.data);

                            switch (data.action) {
                                case 'LEVEL END SCREEN':
                                    var i = 10;
                                    var interval = setInterval(function() {
                                        if (i === 0) {
                                            clearInterval(interval);
                                            scope.status = EnumStatus.STATUS_START;
                                        } else {
                                            scope.status = i;
                                        }
                                        statusEl.innerHTML = scope.status;
                                        scope.render();
                                        i--;
                                    }, 1000);
                                    break;
                            }
                        };

                        Game.trigger('authenticate');

                        //TODO BLOCKING CHANGE
                        var onclick = function() {
                            if (scope.status === EnumStatus.STATUS_START) {
                                Game.trigger('onStart');
                            } else {
                                Game.trigger('onFire');
                            }
                        };
                        var clickableArea = document.getElementById('clickableArea');
                        if (clickableArea.ontouchstart) {
                            clickableArea.ontouchstart = onclick;
                        } else {
                            clickableArea.onclick = onclick;
                        }
                        clickableArea.onscroll = onclick;
                        try {
                            clickableArea.ontouchstart = function() {
                                clickableArea.className = 'hover';
                            };
                            clickableArea.ontouchend = function() {
                                clickableArea.className = '';
                            };
                        } catch (ex) {}
                    };
                }
            };
            Game.init();

            this.Game = Game;
            this.Enums = {
                'MOVE': EnumMovement,
                'ACTION': EnumAction,
                'STATUS': EnumStatus
            }

        }
    });
});
