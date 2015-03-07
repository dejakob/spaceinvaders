module.exports = function(cb) {
    var _request = this.request;
    var _response = this.response;

    var assigns = {};
    assigns['test'] = 123;

    cb(assigns);
};