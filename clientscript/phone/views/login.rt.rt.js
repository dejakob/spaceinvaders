define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    return function () {
        return React.createElement('div', { 'className': 'relative' }, React.createElement('article', { 'className': 'm10' }, React.createElement('h1', { 'id': 'phoneTitle' }, 'Space', React.createElement('br', {}), 'invaders')), React.createElement('aside', { 'id': 'fixedButtons' }, React.createElement('button', {
            'className': 'twitter',
            'id': 'btnTwitter'
        }, React.createElement('i', { 'className': 'fa fa-twitter' }), ' Connect with Twitter'), React.createElement('button', { 'id': 'btnPlay' }, 'Just play')));
    };
});