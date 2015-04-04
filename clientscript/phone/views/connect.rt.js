define(['lib/react.js',
    'phone/views/connect.rt.rt',
    'core/geolocation.js',
    'lib/jquery.js'
], function (React, template, Geolocation) {
    'use strict';

    return React.createClass({
        render: template,
        displayName: 'ConnectView',
        servers: null,
        componentDidMount: function() {
            var scope = this;

            Geolocation(function(data) {
                $.getJSON('/API/session.json?action=getByLocation&latitude=' + data.latitude + '&longitude=' + data.longitude, function(data) {
                    scope.servers = data.servers;
                    scope.forceUpdate();
                });
            });

        },
        handleServerSelect: function(server) {
            console.log('SERVER', server);
            if (typeof server.user.id !== 'undefined' && server.user.hash !== 'undefined') {
                var url = window.location.href + '?playerId=' + server.user.id + '&playerHash=' + server.user.hash;
                Phone.changeModule(url);
            }
        }
    });
});
