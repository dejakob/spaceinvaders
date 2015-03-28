module.exports = function(cb) {
    var _request = this.request;
    var _response = this.response;
    var agent = require(GLOBAL.rootpath + '/server/agent')(_request);
    var isMobile = agent.mobile;

    var assigns = {};
    assigns['test'] = 123;
    cb(assigns);


};