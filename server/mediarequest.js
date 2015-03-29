"use strict";

module.exports = function(request, response) {
    var fs = require('fs');
    var url = GLOBAL.rootpath;

    var getContentType = function(file) {
        switch(true)
        {
            case file.endsWith('.jpg'):
            case file.endsWith('.jpeg'):
                return 'image/jpeg';
                break;
            case file.endsWith('.png'):
                return 'image/png';
                break;
            default:
                return 'text/plain';
        }
    };

    var compileFile = function(folder, file) {
        fs.readFile(folder + '/' + file, function(err,content) {
            if (err) {
                response.status(500).send('');
            } else {
                response.setHeader('content-type', getContentType(file));
                response.status(200);
                response.send(content);
            }
        });
    };

    return {
        'compile': function() {
            var file;

            fs.exists(url + request.originalUrl, function(exists) {
                if (exists) {
                    compileFile(url, request.originalUrl);
                } else {
                    response.status(404).send('');
                }
            });
        }
    };
};