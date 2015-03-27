require([
    'lib/jquery.js',
    'screen/spaceview.js',
    'components/gamesocket.js',
    'components/gamelevel.js',
    'components/gamelevel.hittest.js'
], function() {
    Polymer('singlegame-view', {
        qrcode: null,
        left: 0,
        stepX: 20,
        score: 0,
        multiplayer: false,
        ready: function() {
            var self = this;
            var callbacks = {};

            self.gameSocket = new GameSocket(self);
            self.gameSocket.init(callbacks);

            callbacks['initView'] = function() {
                console.log('init view', self.height, self.width);

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
                self.currentLevel = new GameLevel(self);
                self.currentLevel.width = self.width;
                self.currentLevel.height = self.height;
                self.currentLevel.enemyWidth = self.enemyWidth;
                self.currentLevel.startLevel(levelId, speedX, speedY);
                self.currentLevel.onEndLevel = function() {
                    callbacks.showDialog('Level complete', 'Use your fancy controller to start the next level...');
                    self.currentLevel.endLevel();
                };

                self.currentLevel.onEnemiesChanged = function(enemies) {
                    self.enemies = enemies;
                };

                callbacks.hideDialog();
            };
            callbacks['onOtherUserEndLevel'] = function() {
                console.log('onOtherUserEndLevel', self.multiplayerPlayer);
                if (self.multiplayer !== false && typeof self.multiplayerGame !== 'undefined') {
                    var otherPlayersCount = Web.MultiplayerGames.getPlayerCount(self.multiplayer);
                    var otherPlayersEnded = Web.MultiplayerGames.getPlayersEnded(self.multiplayer);
                    otherPlayersEnded++;
                    Web.MultiplayerGames.setPlayersEnded(self.multiplayer, otherPlayersEnded);

                    console.log('CHECK in onOtherUserEndLevel', otherPlayersEnded, otherPlayersCount);
                    if (otherPlayersEnded === otherPlayersCount) {
                        self.currentLevel.otherUsersEnded();
                    }
                }
            };
            callbacks['onOtherUserEndLevelSafe'] = function() {
                self.currentLevel.otherUsersEndedSafe();
            };
            callbacks['onPrepareEndLevel'] = function() {
                self.currentLevel.prepareEndLevel();
                if (self.multiplayer === false) {
                    self.currentLevel.otherUsersEnded();
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
                dialog.setAttribute('title', title);
                dialog.setAttribute('content', content);
                dialog.setAttribute('show', '');
            };
            callbacks['hideDialog'] = function() {
                var dialog = self.shadowRoot.querySelector('dialog-view');
                if (dialog.hasAttribute('show')) {
                    dialog.removeAttribute('show');
                }
            }
        },
        heightChanged: function() {

        },
        widthChanged: function() {

        }
    });
});