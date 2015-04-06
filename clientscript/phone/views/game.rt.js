define([
    'lib/react.js',
    'phone/views/game.rt.rt',
    'lib/socketio.js',
    'core/rotatedevice.js'
    ],
    function (React, template, io) {
    'use strict';

    var EnumMovement = {
        'MOVEMENT_PARK': 'PARK',
        'MOVEMENT_LEFT': 'LEFT',
        'MOVEMENT_RIGHT': 'RIGHT'
    };

    var EnumAction = {
        'ACTION_AUTH': 'AUTH',
        'ACTION_AUTH_FAILED': 'AUTH FAILED',
        'ACTION_START': 'START LEVEL',
        'ACTION_FIRE': 'FIRE',
        'ACTION_CONTROL': 'CONTROL'
    };

    var EnumStatus = {
        'STATUS_START': 'START',
        'STATUS_FIRE': 'FIRE',
        'STATUS_GAME_OVER': 'LOSER!',
        'STATUS_ERROR': 'ERR'
    };

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

                                socket.emit(EnumAction.ACTION_AUTH, {
                                    'playerId': urlQuery['playerId'],
                                    'playerHash': urlQuery['playerHash']
                                });

                                Game.isAuthenticated = true;
                            });
                        },
                        onLeft: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_LEFT) {
                                socket.emit(EnumAction.ACTION_CONTROL, {
                                    'x': -10
                                });
                                Game.Controller.movement = EnumMovement.MOVEMENT_LEFT;
                            }
                        },
                        onRight: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_RIGHT) {
                                socket.emit(EnumAction.ACTION_CONTROL, {
                                    'x': +10
                                });
                                Game.Controller.movement = EnumMovement.MOVEMENT_RIGHT;
                            }
                        },
                        onPark: function() {
                            if (Game.Controller.movement !== EnumMovement.MOVEMENT_PARK) {
                                socket.emit(EnumAction.ACTION_CONTROL, {
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
                            socket.emit(EnumAction.ACTION_START);
                        },
                        onFire: function() {
                            if (Game.isAuthenticated) {
                                socket.emit(EnumAction.ACTION_FIRE);
                            }
                        },
                        onGameOver: function() {
                            var url = window.location.href.split('?')[0];
                            this.blockRequests = true;
                            Phone.changeModule(url);
                        }
                    };

                    if (typeof _triggers[key] !== 'undefined') {
                        _triggers[key]();
                    }
                },
                init: function() {

                    socket = io.connect('http://'+ BASE_URL + ':' + serverPort);

                    socket.on('connect', function() {
                        RotateDevice.addBetaListener(function(x) {
                            var direction;

                            if (Game.isAuthenticated) {
                                direction = parseInt(x*100);
                                if (direction > 1000) {
                                    Game.trigger('onRight');
                                    setTimeout(function() {Game.trigger('onRight');},100); //Fallback
                                } else if (direction < -1000) {
                                    Game.trigger('onLeft');
                                    setTimeout(function() {Game.trigger('onLeft');},100);
                                } else {
                                    Game.trigger('onPark');
                                    setTimeout(function() {Game.trigger('onPark');},100);
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

                        socket.on('LEVEL END SCREEN', function(data) {
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
                        });

                        socket.on('GAME OVER', function(data) {
                           scope.status = EnumStatus.STATUS_GAME_OVER;
                           scope.render();
                           scope.forceUpdate();
                        });

                        socket.on(EnumAction.ACTION_AUTH_FAILED, function(data) {
                            scope.showError = true;
                            scope.status = EnumStatus.STATUS_ERROR;
                            scope.render();
                            scope.forceUpdate();
                        });

                        socket.on('PING', function(data) {
                            socket.emit('PONG');
                        });

                        Game.trigger('authenticate');
                    });

                }
            };
            Game.init();

            $('#clickableArea').on('touchstart', function() {
                if (scope.status === EnumStatus.STATUS_START) {
                    scope.Game.trigger('onStart');
                } else if (scope.status === EnumStatus.STATUS_FIRE) {
                    scope.Game.trigger('onFire');
                } else if (scope.status === EnumStatus.STATUS_GAME_OVER) {
                    scope.Game.trigger('onGameOver');
                }
                return true;
            });

            this.Game = Game;
            this.Enums = {
                'MOVE': EnumMovement,
                'ACTION': EnumAction,
                'STATUS': EnumStatus
            }

        }
    });
});
