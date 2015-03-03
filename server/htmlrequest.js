"use strict";

module.exports = function(request, response) {
    var handlebars = require('handlebars');
    var agent = require(GLOBAL.rootpath + '/server/agent')(request);
    var fs = require('fs');

    var isMobile = agent.mobile;
    var url = GLOBAL.rootpath;

    var compileFile = function(folder, file) {
        fs.readFile(folder + file, function(err,content) {
            if (err) {
                compileFile(folder, '/500.html');
            } else {
                var template = handlebars.compile(content.toString());
                var assigns = {};
                response.status(200).send(template(assigns));
            }
        });
    };

    return {
        'compile': function() {
            var file;
            if (isMobile) {
                url += "/phone";
            } else {
                url += "/screen";
            }

            fs.exists(url + request.originalUrl + '.html', function(exists) {
                if (exists) {
                    file = request.originalUrl;
                } else {
                    if (request.originalUrl === '/') {
                        file = '/index.html';
                    } else {
                        file = '/404.html';
                    }
                }

                compileFile(url, file);

            });
        }
    };
};