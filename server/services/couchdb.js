var _onConnect = function(cb) {
    var nodeCouchDB = require("node-couchdb");
    // use memcached with "memcache" NPM package
    // var memcacheClient = require("memcache").Client(11211, "localhost");
    //  memcacheClient.connect();
    // memcacheClient.on("connect", function () {
    // memcacheClient.invalidate = function () {};
    var couch = new nodeCouchDB("localhost", 5984);
    GLOBAL.db = couch;
    cb(couch);
    // });

};


module.exports = {
    onConnect: function(cb) {
        _onConnect(cb);
    }
};