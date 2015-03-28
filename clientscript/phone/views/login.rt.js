define(['lib/react.js', './login.rt.rt.js', 'lib/jquery.js'], function (React, template) {
    'use strict';

    return React.createClass({
        componentDidMount: function() {
            var screenWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
            var phoneTitle = document.getElementById('phoneTitle');
            var phoneTitleMargin = (screenWidth - phoneTitle.offsetHeight - 60) / 2;
            phoneTitle.setAttribute('style', 'padding-top: ' + phoneTitleMargin + 'px; padding-bottom: ' + phoneTitleMargin + 'px;');

            var twitterLoginButton = $('#btnTwitter');
            twitterLoginButton.on('click', function() {
                require(["phone/helpers/url.js"], function(UrlHelper) {
                    var queryParams = UrlHelper.getQuery();
                    queryParams.action = 'auth';
                    var baseUrl = '/API/twitter.json' + UrlHelper.paramsToString(queryParams);
                    console.log('baseUrl', baseUrl);
                    $.getJSON(baseUrl, function(data) {
                        console.log('DATA', data);
                        if (data.url !== false) {
                            window.location.href = data.url;
                        }
                    });
                });

            });

            var startPlay = $('#btnPlay');
            startPlay.on('click', function() {
                require(["phone/helpers/url.js"], function(UrlHelper) {
                    var queryParams = UrlHelper.getQuery();
                    queryParams.action = 'play';
                    window.location.href = window.location.href.split('?')[0] + UrlHelper.paramsToString(queryParams);
                });
            });
        },
        displayName: 'LoginView',
        render: template
    });


});
