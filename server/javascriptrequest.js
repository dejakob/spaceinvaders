"use strict";

module.exports = function(request, response) {
    var agent = require(GLOBAL.rootpath + '/server/agent')(request);
    var fs = require('fs');
    var isMobile = agent.mobile;
    var url = GLOBAL.rootpath + '/clientscript';

    var compileFile = function(folder, file) {
        fs.readFile(folder + file, function(err,content) {;
            if (err) {
                response.send('');
            } else {
                response.send(content.toString());
            }
        });
    };

    return {
        'compile': function() {
            var file;

            fs.exists(url + request.originalUrl + '.js', function(exists) {
                if (exists) {
                    compileFile(url, file);
                } else {
                    compileFile(url, isMobile ? 'phone.js' : 'screen.js');
                }
            });
        }
    };
};