var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8004});
wss.on('connection', function(ws) {
    var d = require('domain').create();
    d.on('error', function(err) {
        console.log('UNCAUGHT ERROR', err);
    });
    d.run(function() {
        require(GLOBAL.rootpath + '/server/spacelogic/spacesocket.js')(ws);
    });
});