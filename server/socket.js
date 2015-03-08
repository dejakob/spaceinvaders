var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 6666});
wss.on('connection', function(ws) {
    require(GLOBAL.rootpath + '/server/spacelogic/spacesocket.js')(ws);
});