define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    function repeatServer1(server, serverIndex) {
        return React.createElement('li', { 'onClick': this.handleServerSelect.bind(this, server) }, React.createElement('span', { 'className': 'userCircle' }, server.user.id), server.nearby ? React.createElement('span', { 'className': 'msg' }, 'Click to play with user ', server.user.id) : null, server.nearby ? React.createElement('span', { 'className': 'nearby' }, 'Nearby ', server.nearby) : null);
    }
    return function () {
        return React.createElement('div', { 'className': 'connect' }, React.createElement('h1', {}, 'Please select a server'), React.createElement.apply(this, _.flatten([
            'ul',
            {},
            _.map(this.servers, repeatServer1.bind(this))
        ])));
    };
});