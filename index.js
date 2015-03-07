var app = require('express')();
var http = require('http').Server(app);

require('./server/global.js');

app.use(function(req, res, next) {
    switch (true) {
        case req.originalUrl.endsWith('.js'):
            var javascriptRequest = require(GLOBAL.rootpath + '/server/javascriptrequest.js')(req, res);
            javascriptRequest.compile();
            break;
        case req.originalUrl.endsWith('.css'):
            var cssRequest = require(GLOBAL.rootpath + '/server/cssrequest.js')(req, res);
            cssRequest.compile();
            break;
        case req.originalUrl.toLowerCase().endsWith('.jpg'):
        case req.originalUrl.toLowerCase().endsWith('.jpeg'):
        case req.originalUrl.toLowerCase().endsWith('.gif'):
        case req.originalUrl.toLowerCase().endsWith('.png'):
        case req.originalUrl.toLowerCase().endsWith('.mp4'):
        case req.originalUrl.toLowerCase().endsWith('.ico'):
            var mediaRequest = require(GLOBAL.rootpath + '/server/mediarequest.js')(req, res);
            mediaRequest.compile();
            break;
        default:
            var htmlRequest = require(GLOBAL.rootpath + '/server/htmlrequest.js')(req, res);
            res.set('content-type', 'text/html');
            htmlRequest.compile();
            break;
    }

    //next();
});

http.listen(8888, function(){
    console.log('listening on *:8888');
});