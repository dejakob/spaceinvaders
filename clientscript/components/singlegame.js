require([
    'lib/socketio.js',
    'lib/jquery.js',
    'screen/spaceview.js',
    'components/gamesocket.js',
    'components/gamelevel.js',
    'components/gamelevel.hittest.js',
    'components/gamelevel.animater.js'
], function(io) {
    Polymer('singlegame-view', {
        qrcode: null,
        left: 0,
        stepX: 20,
        score: 0,
        multiplayer: false,
        isLastLevel: false,
        lives: [],
        livesLeft: 3,
        ready: function() {
            var self = this;
            var callbacks = {};

            self.gameSocket = new GameSocket(self, io);
            self.gameSocket.init(callbacks);

            callbacks['initView'] = function() {

                self.showGame = true;
                var spaceshipWidth = self.width / 10;
                self.spaceship = {
                    left: (self.width - spaceshipWidth) / 2,
                    width: spaceshipWidth,
                    bottom: 15,
                    height: 1.5 * spaceshipWidth
                };

                self.enemyWidth = spaceshipWidth / 2;
                self.enemyHeight = spaceshipWidth / 2;

                self.stepX = self.width / 50;

                if (self.multiplayer !== false) {
                    self.multiplayerGame = Web.MultiplayerGames.getMultiplayerGame(self.multiplayer);
                    self.multiplayerPlayer = Web.MultiplayerGames.addPlayerToGame(self.multiplayer);
                    self.multiplayerPlayer.addListener('otherUserEnd', callbacks.onOtherUserEndLevel);
                    self.multiplayerPlayer.addListener('otherUserEndSafe', callbacks.onOtherUserEndLevelSafe);
                }

            };
            callbacks['onLeft'] = function() {
                if (typeof self.spaceship !== 'undefined') {
                    self.spaceship.movement = 'LEFT';
                }
            };
            callbacks['onRight'] = function() {
                if (typeof self.spaceship !== 'undefined') {
                    self.spaceship.movement = 'RIGHT';
                }
            };
            callbacks['onPark'] = function() {
                if (typeof self.spaceship !== 'undefined') {
                    self.spaceship.movement = 'PARK';
                }
            };
            callbacks['startLevel'] = function(levelId, speedX, speedY) {

                if (self.multiplayer !== false) {
                    callbacks.reCheckPlayers();
                }

                self.currentLevel = new GameLevel(self);
                self.currentLevel.width = self.width;
                self.currentLevel.height = self.height;
                self.currentLevel.enemyWidth = self.enemyWidth;
                self.currentLevel.startLevel(levelId, speedX, speedY);
                self.currentLevel.onEndLevel = function() {
                    console.log('ON END LEVEL');
                    if (!self.isGameOver) {
                        self.fires = [];
                        if (self.isLastLevel) {
                            callbacks.showDialog('End of game', 'Congrats! You finished this game!');
                            setTimeout(function() {
                                Web.LoaderCallbacks.changeView('highscores');
                                try {
                                    self.socket.emit('DISCONNECT');
                                    self.socket.disconnect();
                                } catch (ex) {console.log('EX', ex)}
                            }, 4000);
                        } else {
                            console.log('IS NOT LAST LEVEL');
                            callbacks.showDialog('Level complete', 'Use your fancy controller to start the next level...');
                        }
                    }
                    self.currentLevel.endLevel();
                };
                self.currentLevel.showStamp = callbacks.showStamp;
                self.showDialog = callbacks.showDialog;
                self.onGameOver = callbacks.onGameOver;

                self.currentLevel.onEnemiesChanged = function(enemies) {
                    self.enemies = enemies;
                };

                callbacks.hideDialog();
                callbacks.hideStamp();
            };
            callbacks['reCheckPlayers'] = function() {
                Web.MultiplayerGames.removeLosers(self.multiplayer);
            };
            callbacks['onOtherUserEndLevel'] = function() {
                self.multiplayerPlayer.setScore(self.score);
                if (self.multiplayer !== false && typeof self.multiplayerGame !== 'undefined') {
                    var otherPlayersCount = Web.MultiplayerGames.getPlayerCount(self.multiplayer);
                    var otherPlayersEnded = Web.MultiplayerGames.getPlayersEnded(self.multiplayer);
                    otherPlayersEnded++;
                    Web.MultiplayerGames.setPlayersEnded(self.multiplayer, otherPlayersEnded);

                    console.log('onOtherUserEndLevel', otherPlayersEnded, otherPlayersCount);
                    if (otherPlayersEnded === otherPlayersCount) {
                        self.currentLevel.otherUsersEnded();
                    }
                }
            };
            callbacks['onOtherUserEndLevelSafe'] = function() {
                self.multiplayerPlayer.setScore(self.score);
                self.currentLevel.otherUsersEndedSafe();
            };
            callbacks['onPrepareEndLevel'] = function(isLastLevel) {
                self.isLastLevel = isLastLevel;
                self.currentLevel.prepareEndLevel();
                if (self.multiplayer === false || Web.MultiplayerGames.getPlayerCount(self.multiplayer) < 2) {
                    self.currentLevel.otherUsersEnded();
                }
            };
            callbacks['onGameOver'] = function() {
                console.log('GAME FUCKING OVER!');
                callbacks.onPrepareEndLevel(self.isLastLevel);
                self.isGameOver = true;
                if (self.multiplayer !== false) {
                    self.multiplayerPlayer.setIsGameOver(self.isGameOver);
                }

                try {
                    self.socket.emit('GAME OVER');
                } catch (ex) {console.log('EX', ex)}
                if (self.multiplayer) {
                    //Web.MultiplayerGames.removePlayerFromGame(self.multiplayer, self.multiplayerPlayer.id);
                    //Web.MultiplayerGames.updatePlayer(self.multiplayer, self.multiplayerPlayer.id, 'isGameOver', true);
                    self.multiplayerPlayer.triggerForAllOtherPlayersInGame('otherUserEnd');
                } else {
                    setTimeout(function() {
                        Web.LoaderCallbacks.changeView('highscores');
                    }, 4000);
                }
            };
            callbacks['onEnemy'] = function(enemyType) {
                //TODO CHANGE
                self.currentLevel.enemiesChanged(enemyType);

            };
            callbacks['onFire'] = function() {
                self.currentLevel.fire();
            };
            callbacks['showDialog'] = function(title, content) {
                var dialog = self.shadowRoot.querySelector('dialog-view');
                dialog.setAttribute('code', title);
                dialog.setAttribute('content', content);
                dialog.setAttribute('show', '');
            };
            callbacks['hideDialog'] = function() {
                var dialog = self.shadowRoot.querySelector('dialog-view');
                if (dialog.hasAttribute('show')) {
                    dialog.removeAttribute('show');
                }
            };
            callbacks['showStamp'] = function(amIWinner) {
                var gameStamp = self.shadowRoot.querySelector('game-stamp');
                gameStamp.setAttribute('show', '');
                if (amIWinner) {
                    gameStamp.setAttribute('type', 'win');
                } else {
                    gameStamp.setAttribute('type', 'lose');
                }
            };
            callbacks['hideStamp'] = function() {
                var gameStamp = self.shadowRoot.querySelector('game-stamp');
                if (gameStamp.hasAttribute('show')) {
                    gameStamp.removeAttribute('show');
                }
            };
        },
        heightChanged: function() {

        },
        widthChanged: function() {

        }
    });
});