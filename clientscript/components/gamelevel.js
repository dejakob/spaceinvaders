var GameLevel = (function() {
    var _gameHeight;
    var _currentLevelId = 0;
    var _interval;
    var _enemies;
    var _fires;

    return {
        'startLevel': function(lvlId, speedX, speedY, scope) {
            _currentLevelId = lvlId;
            var self = this;
            var stepX = (self.width / speedX * 40) / 1000;
            console.log('STEPX', stepX);
            var stepY = (self.height / speedY * 40) / 1000;

            _interval = setInterval(function() {
                var len;
                var i;
                var hittest = new Hittest(scope);

                if (_enemies) {
                    len = _enemies.length;
                    for (i = 0; i < len; i++) {
                        var enemy = _enemies[i];
                        if (typeof enemy !== 'undefined') {
                            enemy.top += stepY;
                            enemy.left += (stepX * enemy.directionX);

                            if (enemy.left > (self.width - self.enemyWidth)) {
                                enemy.directionX = -1;
                            }

                            if (enemy.left < 0) {
                                enemy.directionX = 1;
                            }

                            if (enemy.top >= scope.height) {
                                _enemies.splice(i,1);
                                i--;
                            } else {
                                _enemies[i] = enemy;
                            }

                            //Hit tests
                            if (_fires) {
                                var fireLen = _fires.length;
                                if (fireLen) {
                                    for (var j = 0; j < fireLen; j++) {
                                        if (typeof _fires[j] !== 'undefined') {
                                            if (hittest.test(_fires[j], enemy)) {
                                                console.log('HIT');
                                                _enemies.splice(i,1);
                                                _fires.splice(j,1);
                                                i--;
                                                j--;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    self.onEnemiesChanged(_enemies);
                }

                if (_fires) {
                    len = _fires.length;
                    for (i = 0; i < len; i++) {
                        var fire = _fires[i];
                        if (typeof fire !== 'undefined') {
                            fire.bottom += 10;

                            if (fire.bottom >= scope.height) {
                                _fires.splice(i,1);
                                i--;
                            } else {
                                _fires[i] = fire;
                            }
                        }
                    }
                }
            }, 40);
        },
        'endLevel': function() {
            GameSocket.send({
                'action': 'END LEVEL'
            });
        },
        'enemiesChanged': function(scope, enemyType) {
            _enemies = scope.enemies;
            console.log('ENEMIES', _enemies);
            var startX = scope.width - 10;
            var startY = -10;
            var enemy = {
                left: startX,
                directionX: -1,
                top: startY,
                width: scope.enemyWidth,
                height: scope.enemyHeight
            };
            scope.enemies.push(enemy);
        },
        'fire': function(scope) {
            _fires = scope.fires;
            var fireWidth = 6;
            var startX = scope.spaceship.left + (scope.spaceship.width - fireWidth) / 2;
            var startY = scope.spaceship.bottom + scope.spaceship.height;
            var fire = {
                left: startX,
                bottom: startY,
                width: 6,
                height: 6
            };
            scope.fires.push(fire);
        }
    }
})();