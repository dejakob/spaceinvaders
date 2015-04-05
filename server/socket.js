module.exports = function(httpServer) {

    var io = require('socket.io').listen(httpServer);
    var pingpong = require(GLOBAL.rootpath + '/server/spacelogic/pingpong.js');
    pingpong.start();

    io.on('connection', function(ws) {
        var d = require('domain').create();
        d.on('error', function(err) {
            console.log('UNCAUGHT ERROR', err);
        });
        d.run(function() {
            require(GLOBAL.rootpath + '/server/spacelogic/spacesocket.js')(ws, pingpong);
        });
    });
};
