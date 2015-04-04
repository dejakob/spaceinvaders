define(['phone/helpers/url.js'], function(UrlHelper) {

    var urlQuery = UrlHelper.getQuery();

    window.scrollTo(0, 1);

    if (typeof urlQuery['oauth'] !== 'undefined' && urlQuery['oauth'] === 'complete') {
        require(["phone/controllers/game"])();
    } else if (typeof urlQuery['action'] !== 'undefined' && urlQuery['action'] === 'play') {
        require(["phone/controllers/game"])();
    } else if (typeof urlQuery['playerId'] !== 'undefined' && typeof urlQuery['playerHash'] !== 'undefined') {
        require(["phone/controllers/login"])();
    } else {
        require(["phone/controllers/connect"])();
    }
});

