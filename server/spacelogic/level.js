module.exports = function(ws) {
    var _interval = null;
    var _ticker = 0;

    return {
        'loadLevel': function(lvl) {
            return JSON.parse(require('fs').readFileSync(GLOBAL.rootpath + '/server/spacelogic/levels/' + lvl + '.json').toString());
        },
        'startLevel': function(lvl, me) {
            var data = this.loadLevel(lvl);
            console.log('LOAD DATA', data);
            var timeline = data.timeline;
            var currentIndex = 0;
            var currentItem;

            me.onScreen(function(ws) {
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

                console.log('TIME CHCK', currentItem.time, _ticker);

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
            }, 40);
        },
        'endLevel': function(lvl) {
            if (_interval !== null) {
                clearInterval(_interval);
                _ticker = 0;
            }
        }
    }
};