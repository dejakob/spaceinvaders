define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    function repeatServer1(server, serverIndex) {
        return React.createElement('li', {
            'className': 'click',
            'onClick': this.handleServerSelect.bind(this, server)
        }, React.createElement('span', { 'className': 'userCircle' }, server.user.id), server.nearby ? React.createElement('span', { 'className': 'msg' }, 'Click to play with user ', server.user.id) : null, server.nearby ? React.createElement('span', { 'className': 'nearby' }, 'Nearby ', server.nearby) : null);
    }
    return function () {
        return React.createElement('div', { 'className': 'connect' }, React.createElement('h1', {}, 'Please select a server'), this.servers ? React.createElement.apply(this, _.flatten([
            'ul',
            { 'style': { height: this.serversHeight + 'px' } },
            _.map(this.servers, repeatServer1.bind(this)),
            !this.servers.length ? React.createElement('li', {}, React.createElement('span', { 'className': 'p5' }, 'No servers active. Please browse to this website on your desktop to host a game.')) : null
        ])) : null, !this.servers ? React.createElement('div', {}, '\n        Waiting for available servers nearby. Please turn on your location settings and wait.\n    ') : null);
    };
});