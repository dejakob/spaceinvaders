module.exports = function() {
    var request = this.request;
    var response = this.response;

    var getList = function(callback) {
        var items = [];

        var procedureScore = require(GLOBAL.rootpath + '/server/procedures/scores.js');
        procedureScore.getList(function(results) {
            callback(results);
        });

    };

    return {
        getList: getList
    }
};