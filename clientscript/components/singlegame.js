require([
    'lib/jquery.js',
    'screen/spaceview.js',
    'components/gamesocket.js',
    'components/gamelevel.js'
], function() {

    Polymer('singlegame-view', {
        qrcode: null,
        left: 0,
        stepX: 20,
        score: 100,
        enemies: [],
        currentLevel: null,
        ready: function() {
            var self = this;
            var callbacks = {};
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
            callbacks['startLevel'] = function(levelId) {
                GameLevel.startLevel(levelId);
            };
            callbacks['onEnemy'] = function(enemy) {
                //TODO CHANGE
                var startX = self.width - 10;
                var startY = -10;

                self.enemies.push({
                    left: startX,
                    top: startY
                });
            };

            GameSocket.init(this, callbacks);
        },
        heightChanged: function() {

        },
        widthChanged: function() {

        }
    });
});