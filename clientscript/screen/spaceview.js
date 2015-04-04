var SpaceView = (function() {

    return {
        generateAuthUrl: function(cb) {
            $.getJSON('/API/session.json?action=create', function(data) {
                cb({
                    'playerId': data.player.id,
                    'playerHash': data.player.hash
                });
            });
        },
        addLocation: function(data) {
            $.getJSON('/API/session.json?action=addLocation', data, function(data) {});
        }
    };
})();