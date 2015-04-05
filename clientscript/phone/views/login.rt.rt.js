define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    return function () {
        return React.createElement('div', { 'className': 'relative' }, React.createElement('article', { 'className': 'm10' }, React.createElement('h1', { 'id': 'phoneTitle' }, 'Space', React.createElement('br', {}), 'invaders')), React.createElement('aside', {
            'id': 'fixedButtons',
            'className': onlyTwitter ? 'onlyTwitter' : ''
        }, React.createElement('button', {
            'onClick': this.handleTwitterButton.bind(this),
            'className': 'twitter'
        }, React.createElement('i', { 'className': 'fa fa-twitter' }), ' Connect with Twitter'), React.createElement('button', { 'onClick': this.handlePlayButton.bind(this) }, 'Just play')));
    };
});