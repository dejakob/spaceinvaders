var EnumEnemy = {
   'ENEMY_DEFAULT': 1,
   'ENEMY_TWITTER': 2,
   'ENEMY_ANDROID': 3,
   'ENEMY_BOMB': 4
};

var GameLevel = function(scope) {
    var _gameHeight;
    var _currentLevelId = 0;
    var _interval;
    var _enemies;
    var _fires;
    var _levelEnded = false;
    var _triggeredEnd = false;
    var _ticker = 0;

    var startsWith = function(str, txt) {
        var regex = new RegExp('^\\' + txt + '+');
        return (str.replace(regex,'')!==str.toString());
    };

    return {
        'startLevel': function(lvlId, speedX, speedY) {
            _currentLevelId = lvlId;
            _levelEnded = false;
            var self = this;
            var stepX = (self.width / speedX * 40) / 1000;
            var stepY = (self.height / speedY * 40) / 1000;
            var levelAnimater = new Animater(scope);

            scope.livesLeft = 3;
            self.recalculateLives();

            if (!_interval) {
                _interval = setInterval(function() {
                    var len;
                    var i;

                    levelAnimater.tick(_ticker);
                    _ticker++;

                    if (_enemies) {
                        len = _enemies.length;
                        var hittest = new Hittest(scope);
                        var correctedSpaceship = {
                            'left': scope.spaceship.left + (scope.spaceship.width * 0.4),
                            'bottom': scope.spaceship.bottom,
                            'height': scope.spaceship.height,
                            'width': scope.spaceship.width * 0.2
                        };

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
                                    if (enemy.type !== 4) {
                                        scope.score = ((scope.score - 100) <= 0) ? 0 : (scope.score - 100);
                                    }
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
                                                    if (typeof enemy.score === 'number') {
                                                        scope.score += enemy.score;
                                                    } else if (typeof enemy.score === 'string' && startsWith(enemy.score, '*')) {
                                                        scope.score *= enemy.score.replace('*','');
                                                    }
                                                    _enemies.splice(i,1);
                                                    _fires.splice(j,1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }

                                if (hittest.test(enemy, correctedSpaceship)) {
                                    _enemies.splice(i,1);
                                    scope.livesLeft--;
                                    self.recalculateLives();

                                    if (scope.livesLeft) {
                                        levelAnimater.addAnimation({
                                            'type': 'tiktak',
                                            'start': _ticker,
                                            'end': _ticker + 20,
                                            'interval': 1,
                                            'selector': '#spaceship',
                                            'css': {
                                                'opacity': 0.5
                                            }
                                        });
                                    } else {
                                        clearInterval(_interval);
                                        _enemies = [];
                                        _fires = [];
                                        scope.showDialog('Game over', 'Your spaceship got hit by too much obstacles...');
                                        scope.onGameOver();

                                    }

                                }
                            }
                        }
                        self.onEnemiesChanged(_enemies);

                        if (!len && _levelEnded) {
                            if (scope.multiplayer !== false && !_triggeredEnd) {
                                _triggeredEnd = true;

                                var otherPlayersEnded = Web.MultiplayerGames.getPlayersEnded(scope.multiplayer);
                                otherPlayersEnded++;
                                Web.MultiplayerGames.setPlayersEnded(scope.multiplayer, otherPlayersEnded);
                                scope.multiplayerPlayer.triggerForAllOtherPlayersInGame('otherUserEnd');
                            }
                            else if (scope.multiplayer === false) {
                                clearInterval(_interval);
                                levelAnimater.end();
                                self.onEndLevel();
                            }
                        }
                    }

                    if (_fires) {
                        len = _fires.length;
                        for (i = 0; i < len; i++) {
                            var fire = _fires[i];
                            if (typeof fire !== 'undefined') {
                                fire.bottom += 10;

                                if (fire.bottom >= scope.height) {
                                    _fires.splice(i,1);
                                    //i--;
                                } else {
                                    _fires[i] = fire;
                                }
                            }
                        }
                    }

                    if (typeof scope.spaceship !== 'undefined') {
                        if (typeof scope.spaceship.movement !== 'undefined') {
                            switch (scope.spaceship.movement) {
                                case 'LEFT':
                                    if (scope.spaceship.left > 0) {
                                        scope.spaceship.left -= 20;
                                    }
                                    break;
                                case 'RIGHT':
                                    if (scope.spaceship.left < (scope.width - scope.spaceship.width) ) {
                                        scope.spaceship.left += 20;
                                    }
                                    break;
                            }
                        }

                        if (typeof scope.spaceship.movementY !== 'undefined') {
                            switch (scope.spaceship.movementY) {
                                case 'DOWN':
                                    if (scope.spaceship.bottom > 0) {
                                        scope.spaceship.bottom -= 20;
                                    }
                                    break;
                                case 'UP':
                                    if (scope.spaceship.bottom < (scope.height / 3)) {
                                        scope.spaceship.bottom += 20;
                                    }
                                    break;
                            }
                        }
                    }
                }, 40);
            }
        },
        'enemiesChanged': function(enemyType) {
            var startX = scope.width - 10;
            var startY = -10;
            var enemy = {
                left: startX,
                directionX: -1,
                top: startY,
                width: scope.enemyWidth,
                height: scope.enemyHeight,
                type: enemyType
            };

            switch (enemyType) {
                case EnumEnemy.ENEMY_DEFAULT:
                    enemy.score = 100;
                    enemy.css = 'enemy1';
                    break;
                case EnumEnemy.ENEMY_TWITTER:
                    enemy.score = '*2';
                    enemy.css = 'enemy2';
                    break;
                case EnumEnemy.ENEMY_ANDROID:
                    enemy.score = 300;
                    enemy.css = 'enemy3';
                    break;
                case EnumEnemy.ENEMY_BOMB:
                    enemy.score = '*0';
                    enemy.css = 'enemy4';
                    break;
            }

            if (typeof scope.enemies === 'undefined') {
                scope.enemies = [];
            }

            scope.enemies.push(enemy);
            _enemies = scope.enemies;
        },
        'fire': function() {
            var fireWidth = 6;
            var startX = scope.spaceship.left + (scope.spaceship.width - fireWidth) / 2;
            var startY = scope.spaceship.bottom + scope.spaceship.height;
            var fire = {
                left: startX,
                bottom: startY,
                width: 6,
                height: 6
            };

            if (typeof scope.fires === 'undefined') {
                scope.fires = [];
            }

            scope.fires.push(fire);
            _fires = scope.fires;
        },
        'otherUsersEnded': function() {
            if (scope.multiplayer !== false && _levelEnded) {
                this.determineWinner();
                this.onEndLevel();
                scope.multiplayerPlayer.triggerForAllOtherPlayersInGame('otherUserEndSafe');
                Web.MultiplayerGames.setPlayersEnded(scope.multiplayer, 0);
                _triggeredEnd = false;
                clearInterval(_interval);
            }
        },
        'otherUsersEndedSafe': function() {
            this.determineWinner();
            clearInterval(_interval);
            this.onEndLevel();
        },
        'prepareEndLevel': function() {
            _levelEnded = true;
        },
        'endLevel': function() {
            try {
                if (!scope.isGameOver) {
                    scope.gameSocket.send({
                        'action': 'LEVEL END SCREEN',
                        'score': scope.score
                    });
                }
            } catch (ex) {
                console.log('EXCEPTION GAMESOCKET', ex);
            }
        },
        'determineWinner': function() {
            function amIWinner() {
                if (scope.isGameOver) {
                    return false;
                }

                var players = scope.multiplayerGame.players;
                console.log('DETERMINE WINNER', players);
                var keys = Object.keys(players);
                var len = keys.length;
                var scores = [];
                for(var i = 0; i < len; i++) {
                    var k = keys[i];
                    var v = players[k];
                    var score = v.score;
                    if (typeof score !== 'undefined' && !v.isGameOver) {
                        scores.push(score);
                    }
                }
                if (scores.length) {
                    var max = Math.max.apply(null, scores);
                    if (scope.score === max) {
                        return true;
                    }
                }

                return false;
            }

            this.showStamp(amIWinner());
        },
        'recalculateLives': function() {
            scope.lives = [];
            for(var k = 0; k < 3; k++) {
                if (k > (scope.livesLeft - 1)) {
                    scope.lives.push(0.3);
                } else {
                    scope.lives.push(1);
                }
            }
        }
    }
};