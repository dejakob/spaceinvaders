var GameLevel = (function() {
    var _currentLevelId = 0;

    return {
        'startLevel': function(lvlId) {
            _currentLevelId = lvlId;
        },
        'endLevel': function() {
            GameSocket.send({
                'action': 'END LEVEL'
            });
        }
    }
})();