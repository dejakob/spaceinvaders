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
        blockRequests: false,
        componentDidMount: function() {
            var scope = this;

            Geolocation(function(data) {
                var loadData = function() {
                    $.getJSON('/API/session.json?action=getByLocation&latitude=' + data.latitude + '&longitude=' + data.longitude, function(data) {
                        scope.servers = data.servers;
                        scope.forceUpdate();

                        if (!scope.blockRequests) {
                            setTimeout(loadData, 5000);
                        }
                    });
                };
                loadData();
            });

        },
        handleServerSelect: function(server) {
            if (typeof server.user.id !== 'undefined' && server.user.hash !== 'undefined') {
                var url = window.location.href + '?playerId=' + server.user.id + '&playerHash=' + server.user.hash;
                this.blockRequests = true;
                Phone.changeModule(url);
            }
        }
    });
});
