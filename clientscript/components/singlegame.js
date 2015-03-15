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

            };
            callbacks['onLeft'] = function() {
                if (typeof self.spaceship !== 'undefined') {
                    if (self.spaceship.left > 0) {
                        self.spaceship.left -= 20;
                    }
                }
            };
            callbacks['onRight'] = function() {
                if (typeof self.spaceship !== 'undefined') {
                    if (self.spaceship.left < (self.width - self.spaceship.width) ) {
                        self.spaceship.left += 20;
                    }
                }
            };
            callbacks['startLevel'] = function(levelId, speedX, speedY) {
                self.currentLevel = new GameLevel(self);
                self.currentLevel.width = self.width;
                self.currentLevel.height = self.height;
                self.currentLevel.enemyWidth = self.enemyWidth;
                self.currentLevel.startLevel(levelId, speedX, speedY);

                self.currentLevel.onEnemiesChanged = function(enemies) {
                    self.enemies = enemies;
                };
            };
            callbacks['onEnemy'] = function(enemyType) {
                //TODO CHANGE
                self.currentLevel.enemiesChanged(enemyType);

            };
            callbacks['onFire'] = function() {
                self.currentLevel.fire();
            };
            callbacks['onEndLevel'] = function() {
                self.currentLevel.endLevel();
            }
        },
        heightChanged: function() {

        },
        widthChanged: function() {

        }
    });
});