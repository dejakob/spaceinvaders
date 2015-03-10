var GameLevel = (function() {
    var _currentLevelId = 0;
    var _interval;
    var _enemies;

    return {
        'startLevel': function(lvlId, speedX, speedY) {
            _currentLevelId = lvlId;
            var self = this;
            var stepX = (self.width / speedX * 40) / 1000;
            console.log('STEPX', stepX);
            var stepY = (self.height / speedY * 40) / 1000;

            _interval = setInterval(function() {
                if (_enemies) {
                    var len = _enemies.length;
                    for (var i = 0; i < len; i++) {
                        var enemy = _enemies[i];
                        enemy.top += stepY;
                        enemy.left += (stepX * enemy.directionX);

                        if (enemy.left > (self.width - self.enemyWidth)) {
                            enemy.directionX = -1;
                        }

                        if (enemy.left < 0) {
                            enemy.directionX = 1;
                        }

                        _enemies[i] = enemy;
                    }
                    self.onEnemiesChanged(_enemies);
                }
            }, 40);
        },
        'endLevel': function() {
            GameSocket.send({
                'action': 'END LEVEL'
            });
        },
        'enemiesChanged': function(enemies) {
            console.log('ENEMIES', _enemies);
            _enemies = enemies;
        }
    }
})();