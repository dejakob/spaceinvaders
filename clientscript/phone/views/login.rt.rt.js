define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    return function () {
        return React.createElement('div', { 'className': 'relative' }, React.createElement('article', { 'className': 'm10 rel' }, React.createElement('h1', { 'id': 'phoneTitle' }, 'Space', React.createElement('br', {}), 'invaders'), this.showError ? React.createElement('div', { 'className': 'overlay error' }, 'Someone already took your place. Sadly enough, but life is for the quick!') : null), React.createElement('aside', {
            'id': 'fixedButtons',
            'className': onlyTwitter ? 'onlyTwitter' : ''
        }, React.createElement('button', {
            'onClick': this.handleTwitterButton.bind(this),
            'className': 'twitter click'
        }, React.createElement('i', { 'className': 'fa fa-twitter' }), ' Connect with Twitter'), React.createElement('button', {
            'onClick': this.handlePlayButton.bind(this),
            'className': 'click'
        }, 'Just play')));
    };
});