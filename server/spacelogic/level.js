module.exports = function(ws) {

    return {
        'loadLevel': function(lvl) {
            return JSON.parse(require('fs').readFileSync(GLOBAL.rootpath + '/server/spacelogic/levels/' + lvl + '.json').toString());
        },
        'startLevel': function(lvl, me) {
            if (typeof me !== 'undefined' && !me.isLevelStarted) {
                var self = this;
                var data = this.loadLevel(lvl);
                var timeline = data.timeline;
                var currentIndex = 0;
                var currentItem;

                try {
                    me.onScreen(function(ws) {
                        me.isLevelStarted = true;
                        ws.emit('START LEVEL', {
                            levelId: lvl,
                            speedX: data.speedX,
                            speedY: data.speedY
                        });

                        me.ticker = 0;
                        me.interval = setInterval(function() {
                            if (typeof timeline[currentIndex] !== 'undefined') {
                                currentItem = timeline[currentIndex];
                            }

                            if (currentItem.time === me.ticker) {
                                try {
                                    ws.emit('ENEMY', {
                                        enemy: currentItem.enemy
                                    });
                                } catch (ex) {

                                }

                                currentIndex++;
                            }
                            me.ticker+=1;

                            if (currentIndex === timeline.length) {
                                self.endLevel(lvl, me);
                            }
                        }, 40);
                    });

                } catch (ex) {
                    console.log('CANNOT START LEVEL', ex, ex.stack);
                }
            }
        },
        'endLevel': function(lvl, me) {
            if (me.interval !== null) {
                clearInterval(me.interval);
                me.ticker = 0;
            }

            me.onScreen(function(ws) {
                ws.emit('END LEVEL', {
                    isLastLevel: (totalLevelCount === lvl + 1)
                });
            });
        }
    }
};