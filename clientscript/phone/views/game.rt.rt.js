define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    return function () {
        return React.createElement('div', {
            'id': 'clickableArea',
            'className': 'relative'
        }, React.createElement('span', {
            'id': 'status',
            'className': 'statusContent'
        }, this.status));
    };
});