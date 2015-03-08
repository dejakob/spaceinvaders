var SpaceView = function() {

    return {
        generateQRUrl: function(cb) {
            $.getJSON('/API/session.json?action=create', function(data) {
                console.log('data', data);
            });
        }
    };
};