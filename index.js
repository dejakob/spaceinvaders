var app = require('express')();
var http = require('http').Server(app);

require('./server/global.js');

app.use(function(req, res, next) {
    console.log('fdzeferf', req.headers['content-type']);

    switch (true) {
        case req.originalUrl.endsWith('.js'):
            var javascriptRequest = require(GLOBAL.rootpath + '/server/javascriptrequest.js')(req, res);
            javascriptRequest.compile();
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