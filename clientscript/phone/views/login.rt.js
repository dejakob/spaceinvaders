define(['lib/react.js', './login.rt.rt.js', 'lib/jquery.js'], function (React, template) {
    'use strict';

    return React.createClass({
        displayName: 'LoginView',
        render: template,
        showError: false,
        componentDidMount: function() {
            var screenWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
            var phoneTitle = document.getElementById('phoneTitle');
            var phoneTitleMargin = (screenWidth - phoneTitle.offsetHeight - 60) / 2;
            phoneTitle.setAttribute('style', 'padding-top: ' + phoneTitleMargin + 'px; padding-bottom: ' + phoneTitleMargin + 'px;');
        },
        handlePlayButton: function() {
            require(["phone/helpers/url.js"], function(UrlHelper) {
                var queryParams = UrlHelper.getQuery();
                queryParams.action = 'play';
                Phone.changeModule(window.location.href.split('?')[0] + UrlHelper.paramsToString(queryParams));
            });
        },
        handleTwitterButton: function() {
            var scope = this;

            require(["phone/helpers/url.js"], function(UrlHelper) {
                var queryParams = UrlHelper.getQuery();
                queryParams.action = 'auth';
                var baseUrl = '/API/twitter.json' + UrlHelper.paramsToString(queryParams);

                $.getJSON(baseUrl, function(data) {
                    if (data.url !== false) {
                        window.location.href = data.url;
                    } else {
                        scope.showError = true;
                        scope.forceUpdate();
                    }
                });
            });
        }
    });


});
