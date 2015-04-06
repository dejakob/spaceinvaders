define([
    'react/addons',
    'lodash'
], function (React, _) {
    'use strict';
    return function () {
        return React.createElement('div', {
            'id': 'clickableArea',
            'className': 'relative click'
        }, this.showError ? React.createElement('div', { 'className': 'overlay error' }, 'Someone already took your place. Sadly enough, but life is for the quick!') : null, React.createElement('span', {
            'id': 'status',
            'className': 'statusContent'
        }, this.status));
    };
});