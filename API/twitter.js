module.exports = function() {
    var request = this.request;
    var response = this.response;

    var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');
    var SpacePlayer = require(GLOBAL.rootpath + '/server/spacelogic/spaceplayer.js');

    var twitterAuth = function(callback) {
    
        var d = require('domain').create();
        d.on('error', function(err) {
            callback({url: false});
        });
        d.run(function() {
            try
            {
                if (!request.query.playerId || !request.query.playerHash)
                    throw '';

                var player = SpaceLogic.getPlayerById(request.query.playerId);
                if (request.query.playerHash !== player.hash)
                    throw '';

                var callbackUrl = 'http://' + request.headers.host;

                var OAuth = require('oauth').OAuth
                    , oauth = new OAuth(
                        "https://api.twitter.com/oauth/request_token",
                        "https://api.twitter.com/oauth/access_token",
                        TWITTER_CONSUMER_KEY,
                        TWITTER_CONSUMER_SECRET,
                        "1.0",
                        callbackUrl + '?playerId=' + player.id + '&playerHash=' + player.hash + '&oauth=complete', //TODO CHANGE
                        "HMAC-SHA1"
                    );

                oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
                    if (error) {
                        callback({url: false});
                    }
                    else {
                        player.twitterAuthUrl = 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token;
                        SpaceLogic.updatePlayer(player.id, 'twitterAuthUrl', player.twitterAuthUrl);
                        SpaceLogic.updatePlayer(player.id, 'twitterTempToken', oauth_token);
                        SpaceLogic.updatePlayer(player.id, 'twitterTempSecret', oauth_token_secret);
                        callback({url: player.twitterAuthUrl});
                    }
                });
            }
            catch (ex) {
                callback({url: false});
            }
    
        });
    
    };
    
    return {
        auth: twitterAuth
    }
};