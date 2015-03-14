module.exports = function(ws) {
    var _interval = null;
    var _ticker = 0;
    var _isLevelStarted = false;

    return {
        'loadLevel': function(lvl) {
            return JSON.parse(require('fs').readFileSync(GLOBAL.rootpath + '/server/spacelogic/levels/' + lvl + '.json').toString());
        },
        'startLevel': function(lvl, me) {
            if (!_isLevelStarted) {
                var self = this;
                var data = this.loadLevel(lvl);
                console.log('LOAD DATA', data);
                var timeline = data.timeline;
                var currentIndex = 0;
                var currentItem;

                try {
                    me.onScreen(function(ws) {
                        _isLevelStarted = true;
                        ws.send(JSON.stringify({
                            action: 'START LEVEL',
                            levelId: lvl,
                            speedX: data.speedX,
                            speedY: data.speedY
                        }));
                    });

                    _interval = setInterval(function() {
                        if (typeof timeline[currentIndex] !== 'undefined') {
                            currentItem = timeline[currentIndex];
                        }

                        if (currentItem.time === _ticker) {
                            me.onScreen(function(ws) {
                                try {
                                    ws.send(JSON.stringify({
                                        action: 'ENEMY',
                                        enemy: currentItem.enemy
                                    }));
                                } catch (ex) {

                                }
                            });

                            currentIndex++;
                        }
                        _ticker+=1;

                        if (currentIndex === timeline.length) {
                            self.endLevel(lvl);
                        }
                    }, 40);

                } catch (ex) {
                    console.log('CANNOT START LEVEL')
                }
            }
        },
        'endLevel': function(lvl) {
            _isLevelStarted = false;
            if (_interval !== null) {
                clearInterval(_interval);
                _ticker = 0;
            }
        }
    }
};