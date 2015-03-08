var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8889});
console.log('loading socket...');
wss.on('connection', function(ws) {
    require(GLOBAL.rootpath + '/server/spacelogic/spacesocket.js')(ws);
});