module.exports = function(cb) {
    var _request = this.request;
    var _response = this.response;
    var agent = require(GLOBAL.rootpath + '/server/agent')(_request);
    var isMobile = agent.mobile;

    if (isMobile && typeof _request.query !== 'undefined' && typeof _request.query.oauth_verifier !== 'undefined') {
        try {
            var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');
            var SpacePlayer = require(GLOBAL.rootpath + '/server/spacelogic/spaceplayer.js');

            if (!_request.query.playerId || !_request.query.playerHash)
                throw 'ERR IN QUERY';

            var player = SpaceLogic.getPlayerById(_request.query.playerId);
            if (_request.query.playerHash !== player.hash)
                throw 'ERR: PLAYER_HASH' + ' # ' + _request.query.playerHash + ' # ' + player.hash;

            var OAuth = require('oauth').OAuth
                , oauth = new OAuth(
                    "https://api.twitter.com/oauth/request_token",
                    "https://api.twitter.com/oauth/access_token",
                    TWITTER_CONSUMER_KEY,
                    TWITTER_CONSUMER_SECRET,
                    "1.0",
                    '?playerId=' + player.id + '&playerHash=' + player.hash + '&oauth=complete',
                    "HMAC-SHA1"
                );

            //function(oauth_token, oauth_token_secret, oauth_verifier,  callback) {
            oauth.getOAuthAccessToken(player.twitterTempToken, player.twitterTempSecret, _request.query.oauth_verifier, function(err, access_token, access_secret) {
                SpaceLogic.updatePlayer(player.id, 'twitterAuthToken', access_token);
                SpaceLogic.updatePlayer(player.id, 'twitterAuthSecret', access_secret);
                cb({});
            });
        } catch (ex) {
            console.log('EXCEPTION', ex);
            cb({});
        }
    } else {
        var assigns = {};
        assigns['test'] = 123;
        cb(assigns);
    }




};