"use strict";

module.exports = function(request, response) {
    var file = request.originalUrl;
    var cleanFileName = file.split('?')[0].replace(/(.json+$|.api+$)/gi, '') + '.js';

    try {
        var controller = require(GLOBAL.rootpath + cleanFileName);

        var ctl = controller.bind({
            request: request,
            response: response
        })();

        ctl[request.query.action](function(output) {
            response.setHeader('content-type','application/json');
            response.status(200).send(output);
        });
    } catch (ex) {
        console.log('EXCEPTION', ex);
        response.setHeader('content-type','application/json');
        response.status(404).send({
            'error': 404
        });
    }

};