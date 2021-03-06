"use strict";

var Web = (function() {
    var _body;
    var _homeArticle;
    var _mainMenu;
    var _viewLoader;
    var _infoButton;
    var _screenDialog;

    require([
        "lib/qrcode.js",
        "lib/jquery.js"
    ], function() {
        _body = $('body');
        _homeArticle = _body.find('#home');
        _mainMenu = _homeArticle.find('#main');
        _viewLoader = _body.find('view-loader');
        _infoButton = _body.find('#infoButton');
        _screenDialog = _body.find('#screenDialog');

        var init = (function() {
            var _initMainMenu = function() {
                var _events = {
                    itemClick: function(event) {
                        if (this === event.target) {
                            var item = this;
                            _homeArticle.addClass('hide');

                            setTimeout(function() {
                                _homeArticle.hide();
                                var input = $(item).find('>input');
                                if (input.length) {
                                    var val = parseInt(input.val());
                                    if (isNaN(val)) {
                                        val = 3;
                                    }
                                    else if (val > 7) {
                                        val = 7;
                                    }
                                    Web.LoaderCallbacks.changeView($(item).data('view'), val);
                                } else {
                                    Web.LoaderCallbacks.changeView($(item).data('view'), null);
                                }
                            }, 1000);
                        }

                    },
                    showInfo: function() {
                        _screenDialog.attr('code', 'About');
                        _screenDialog.attr('height', '400');
                        _screenDialog.attr('width', '400');
                        _screenDialog.attr('content', '<about-view></about-view>');
                        if (_screenDialog[0].hasAttribute('show')) {
                            _screenDialog[0].removeAttribute('show', '');
                        }
                        _screenDialog.attr('show', '');
                    }
                };

                _mainMenu.delegate('>li', 'click', _events.itemClick);
                _infoButton.click(_events.showInfo);
            };

            var _setLoader = function() {
                _viewLoader.attr('height', $(window).height());
                _viewLoader.attr('width', $(window).width());
            };

            $(window).on('resize', function() {Web.PatheticRenderer.runAll('resize')});

            return function() {
                _initMainMenu();
                _setLoader();
                Web.PatheticRenderer.add('resize', _setLoader);
            };
        })();

        init();
    });

    return {
        'PatheticRenderer': {
            'events': {},
            'add': function(on, ev) {
                if (typeof this.events[on] === 'undefined') {
                    this.events[on] = [ev];
                } else {
                    this.events[on].push(ev);
                }
            },
            'runAll': function(val) {
                if (typeof this.events[val] !== 'undefined') {
                    var v = this.events[val];
                    var len = v.length;
                    for (var i = 0; i < len; i++) {
                        v[i]();
                    }
                }
            }
        },
        'MultiplayerGames': (function() {
            var _multiplayergames = {};

            return {
                add: function() {
                    var key = 'GAME_' + (Object.keys(_multiplayergames).length + 1);
                    _multiplayergames[key] = {
                        players: {},
                        playersEnded: 0
                    };

                    return key;
                },
                addPlayerToGame: function(gameKey) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        var key = 'PLAYER_' + (Object.keys(game.players).length + 1);
                        var player = new MultiGamePlayer(gameKey, key);
                        _multiplayergames[gameKey].players[key] = player;
                        return player;
                    }
                    return false;
                },
                getMultiplayerGame: function(key) {
                    if (typeof _multiplayergames[key] !== 'undefined') {
                        return _multiplayergames[key];
                    }
                    return false;
                },
                getPlayerCount: function(gameKey) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        if (typeof game.players !== 'undefined') {
                            return Object.keys(game.players).length;
                        }
                    }
                    return 0;
                },
                getPlayersEnded: function(gameKey) {
                    console.log('MULTIPLAYERGAMES', _multiplayergames);
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        return game.playersEnded;
                    }
                    return 0;
                },
                setPlayersEnded: function(gameKey, playersEnded) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        game.playersEnded = playersEnded;
                    }
                },
                updatePlayer: function(gameKey, playerId, key, val) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        _multiplayergames[gameKey].players[playerId][key] = val;
                    }
                },
                removePlayer: function(gameKey, playerId) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        delete _multiplayergames[gameKey].players[playerId];
                    }
                },
                removeLosers: function(gameKey) {
                    var game = _multiplayergames[gameKey];
                    if (typeof game !== 'undefined') {
                        var players = game.players;
                        var keys = Object.keys(players);
                        var len = keys.length;
                        for(var i = 0; i < len; i++) {
                            var k = keys[i];

                            if (players[k].isGameOver) {
                                delete _multiplayergames[gameKey].players[k];
                            }
                        }
                    }
                }
            }
        })(),
        'LoaderCallbacks': null
    }
})();

var MultiGamePlayer = function(gameKey, userKey) {
    var _listeners = {};

    return {
        addListener: function(name, func) {
            _listeners[name] = func;
        },
        trigger: function(name) {
            if (typeof _listeners[name] === 'function') {
                _listeners[name]();
            }
        },
        triggerForAllOtherPlayersInGame: function(name) {
            var game = Web.MultiplayerGames.getMultiplayerGame(gameKey);
            var players = game.players;
            var len = Object.keys(players).length;
            for (var i = 0; i < len; i++) {
                var otherUserKey = Object.keys(players)[i];
                if (userKey !== otherUserKey) {
                    var otherPlayer = players[otherUserKey];
                    otherPlayer.trigger(name);
                }
            }
        },
        setScore: function(score) {
            Web.MultiplayerGames.updatePlayer(gameKey, userKey, 'score', score);
        },
        setIsGameOver: function(isGameOver) {
            Web.MultiplayerGames.updatePlayer(gameKey, userKey, 'isGameOver', isGameOver);
        }
    }
};