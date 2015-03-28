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
                        console.log(error);
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



/*
 var express = require('express')
 , passport = require('passport')
 , util = require('util')
 , TwitterStrategy = require('passport-twitter').Strategy;

 passport.serializeUser(function(user, done) {
 done(null, user);
 });

 passport.deserializeUser(function(obj, done) {
 done(null, obj);
 });

 passport.use(new TwitterStrategy({
 consumerKey: TWITTER_CONSUMER_KEY,
 consumerSecret: TWITTER_CONSUMER_SECRET,
 callbackURL: "http://127.0.0.1:8003/auth/twitter/callback"
 },
 function(token, tokenSecret, profile, done) {
 console.log('TOKEN TOKEN', token, tokenSecret, profile, done);
 process.nextTick(function () {

 // To keep the example simple, the user's Twitter profile is returned to
 // represent the logged-in user.  In a typical application, you would want
 // to associate the Twitter account with a user record in your database,
 // and return that user instead.
 return done(null, profile);
 });
 }
 ));
 */


/*
 var OAuth = require('oauth');
 var OAuth2 = OAuth.OAuth2;
 var twitterConsumerKey = TWITTER_CONSUMER_KEY;
 var twitterConsumerSecret = TWITTER_CONSUMER_SECRET;
 var oauth2 = new OAuth2(twitterConsumerKey,
 twitterConsumerSecret,
 'https://api.twitter.com/',
 null,
 'oauth2/token',
 null);
 oauth2.getOAuthAccessToken(
 '',
 {'grant_type':null},
 function (e, access_token, refresh_token, results){
 console.log('ACCESS_TOKEN', access_token);
 var twitterService = require('twitter');
 player.twitter = new twitterService({
 consumer_key: TWITTER_CONSUMER_KEY,
 consumer_secret: TWITTER_CONSUMER_SECRET,
 access_token_key: access_token,
 access_token_secret: refresh_token
 });
 console.log('TWITTER', player.twitter);

 player.get('favorites/list', function(res) {
 console.log('RES', res);
 });
 });
 */

/*
 var twitterService = require('twitter');
 player.twitter = new twitterService({
 consumer_key: TWITTER_CONSUMER_KEY,
 consumer_secret: TWITTER_CONSUMER_SECRET
 });
 player.twitter.response('post', '/oauth/request_token', function(res) {
 console.log('RES', res);
 });
 console.log('TWITTER', player.twitter);
 player.twitter.post('/oauth/request_token', function(test) {
 console.log('TEST', test);
 });
 */