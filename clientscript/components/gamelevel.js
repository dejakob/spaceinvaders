var GameLevel = function(scope) {
    var _gameHeight;
    var _currentLevelId = 0;
    var _interval;
    var _enemies;
    var _fires;
    var _levelEnded = false;
    var _triggeredEnd = false;

    return {
        'startLevel': function(lvlId, speedX, speedY) {
            _currentLevelId = lvlId;
            _levelEnded = false;
            var self = this;
            var stepX = (self.width / speedX * 40) / 1000;
            var stepY = (self.height / speedY * 40) / 1000;

            if (!_interval) {
                _interval = setInterval(function() {
                    var len;
                    var i;

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
                                                var hittest = new Hittest(scope);
                                                if (hittest.test(_fires[j], enemy)) {
                                                    scope.score += enemy.score;
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

                        if (!len && _levelEnded) {
                            if (scope.multiplayer !== false && !_triggeredEnd) {
                                _triggeredEnd = true;
                                scope.multiplayerPlayer.triggerForAllOtherPlayersInGame('otherUserEnd');
                            }
                            else if (scope.multiplayer === false) {
                                clearInterval(_interval);
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
                                    i--;
                                } else {
                                    _fires[i] = fire;
                                }
                            }
                        }
                    }

                    if (typeof scope.spaceship !== 'undefined' && typeof scope.spaceship.movement !== 'undefined') {
                        switch(scope.spaceship.movement) {
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
                score: 100 //TODO CHANGE on enemytype
            };

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
            this.determineWinner();

            if (scope.multiplayer !== false && _levelEnded) {
                this.onEndLevel();
                scope.multiplayerPlayer.triggerForAllOtherPlayersInGame('otherUserEndSafe');
                Web.MultiplayerGames.setPlayersEnded(scope.multiplayer, 0);
                _triggeredEnd = false;
                clearInterval(_interval);
                console.log('MULTIPLAYER LEVEL ENDED!');
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
                scope.gameSocket.send({
                    'action': 'LEVEL END SCREEN'
                });
            } catch (ex) {
                console.log('EXCEPTION GAMESOCKET', ex);
            }
        },
        'determineWinner': function() {
            function amIWinner() {
                var players = scope.multiplayerGame.players;
                var keys = Object.keys(players);
                var len = keys.length;
                var scores = [];
                for(var i = 0; i < len; i++) {
                    var k = keys[i];
                    var v = players[k];
                    var score = v.score;
                    if (typeof score !== 'undefined') {
                        scores.push(score);
                        console.log('PLAYER', v);
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
        }
    }
};