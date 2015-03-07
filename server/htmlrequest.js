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
                console.log(500, folder, file);
                compileFile(folder, '/500.html');
            } else {
                var compileMe = function(assigns) {
                    if (typeof assigns === 'undefined') {
                        assigns = {};
                    }

                    var template = handlebars.compile(content.toString());
                    var output = template(assigns);
                    output = output.replace(/\(\(/gi,'{{').replace(/\)\)/gi,'}}'); //Replace (( to {{ for polymer purposes
                    response.status(200).send(output);
                };

                //TODO make recursive controller loader
                var cleanFileName = file.replace(/(\/|.html+$)/gi, '') + '.js';
                fs.exists(GLOBAL.rootpath + '/controllers/' + cleanFileName, function(exists) {
                    if (exists) {
                        var controller = require(GLOBAL.rootpath + '/controllers/' + cleanFileName);
                        controller.bind({
                            request: request,
                            response: response
                        })(function(assigns) {
                            compileMe(assigns);
                        });
                    } else {
                        compileMe();
                    }
                });
            }
        });
    };

    return {
        'compile': function() {
            if (request.originalUrl.endsWith('.htm')) {
                compileFile(url, request.originalUrl);
            } else {
                var file;
                if (isMobile) {
                    url += "/phone";
                } else {
                    url += "/screen";
                }

                fs.exists(url + request.originalUrl, function(exists) {
                    if (exists) {
                        if (fs.lstatSync(url + request.originalUrl).isDirectory()) {
                            file = '/index.html';
                        } else {
                            file = request.originalUrl;
                        }
                    } else {
                        file = '/404.html';
                    }

                    compileFile(url, file);

                });
            }
        }
    };
};