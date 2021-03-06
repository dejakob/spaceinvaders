var app = require('express')();
var http = require('http').Server(app);

require('./server/global.js');
require('./server/socket.js')(http);
require('./server/SECRET.js'); //File is ignored on github, it contains Twitter auth and couchdb auth

var init = function() {
    couchdb.onConnect(function(db) {

        app.use(function(req, res, next) {
            var originalUrl = req.originalUrl.split('?')[0];
            switch (true) {
                case originalUrl.endsWith('.js'):
                    var javascriptRequest = require(GLOBAL.rootpath + '/server/javascriptrequest.js')(req, res);
                    javascriptRequest.compile();
                    break;
                case originalUrl.endsWith('.css'):
                    var cssRequest = require(GLOBAL.rootpath + '/server/cssrequest.js')(req, res);
                    cssRequest.compile();
                    break;
                case originalUrl.toLowerCase().endsWith('.jpg'):
                case originalUrl.toLowerCase().endsWith('.jpeg'):
                case originalUrl.toLowerCase().endsWith('.gif'):
                case originalUrl.toLowerCase().endsWith('.png'):
                case originalUrl.toLowerCase().endsWith('.mp4'):
                case originalUrl.toLowerCase().endsWith('.ico'):
                    var mediaRequest = require(GLOBAL.rootpath + '/server/mediarequest.js')(req, res);
                    mediaRequest.compile();
                    break;
                case originalUrl.toLowerCase().endsWith('.json'):
                    require(GLOBAL.rootpath + '/server/apirequest.js')(req, res);
                    break;
                default:
                    var htmlRequest = require(GLOBAL.rootpath + '/server/htmlrequest.js')(req, res);
                    res.set('content-type', 'text/html');
                    htmlRequest.compile();
                    break;
            }

            //next();
        });

        http.listen(GLOBAL.serverPort, function(){
            console.log('listening on *:' + GLOBAL.serverPort);
        });
    });

};

init();
process.on('uncaughtException', function(err) {
    console.log('UNCAUGHT EXCEPTION', err, err.stack);
    init();
});
