module.exports = function(cb) {
    var _request = this.request;
    var _response = this.response;
    var agent = require(GLOBAL.rootpath + '/server/agent')(_request);
    var isMobile = agent.mobile;

    var assigns = {};
    if (isMobile) {
        if (_request.query.oauth && _request.query.oauth === 'complete') {
            cb();
        } else {
            var SpaceLogic = require(GLOBAL.rootpath + '/server/spacelogic/spacelogic.js');
            var d = require('domain').create();
            d.on('error', function(err) {
                console.log('ERR', err);
                callback({url: false});
            });
            d.run(function() {
                try
                {
                    if (!_request.query.playerId || !_request.query.playerHash)
                        throw '';

                    var player = SpaceLogic.getPlayerById(_request.query.playerId);
                    if (_request.query.playerHash !== player.hash)
                        throw '';

                    var callbackUrl = 'http://' + _request.headers.host;

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
                            console.log(error);
                            cb({url: false});
                        }
                        else {
                            player.twitterAuthUrl = 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token;
                            SpaceLogic.updatePlayer(player.id, 'twitterAuthUrl', player.twitterAuthUrl);
                            SpaceLogic.updatePlayer(player.id, 'twitterAuthToken', oauth_token);
                            SpaceLogic.updatePlayer(player.id, 'twitterAuthSecret', oauth_token_secret);
                            _response.redirect(303, player.twitterAuthUrl);
                        }
                    });
                }
                catch (ex) {
                    console.log('EXCEPTION', ex);
                    cb({url: false});
                }

            });
        }
    } else {
        assigns['test'] = 123;

        cb(assigns);
    }

};