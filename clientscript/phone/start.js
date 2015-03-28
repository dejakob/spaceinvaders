define(['phone/helpers/url.js'], function(UrlHelper) {

    var urlQuery = UrlHelper.getQuery();

    if (typeof urlQuery['oauth'] !== 'undefined' && urlQuery['oauth'] === 'complete') {
        require(["phone/controllers/game"])();
    } else if (typeof urlQuery['action'] !== 'undefined' && urlQuery['action'] === 'play') {
        require(["phone/controllers/game"])();
    } else {
        require(["phone/controllers/login"])();
    }
});

