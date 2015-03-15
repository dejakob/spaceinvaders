"use strict";

var Hittest = function(scope) {

    var _getLeft = function(obj) {
        if (typeof obj.left !== 'undefined') {
            return obj.left;
        }

        if (typeof obj.right !== 'undefined') {
            return (scope.width - obj.right - obj.width);
        }

        return false;
    };

    var _getTop = function(obj) {
        if (typeof obj.top !== 'undefined') {
            return obj.top;
        }

        if (typeof obj.bottom !== 'undefined') {
            return (scope.height - obj.bottom - obj.height);
        }

        return false;
    };

    var _test = function(obj1, obj2, reversed) {
        if (typeof obj1 !== 'undefined' && typeof obj2 !== 'undefined') {
            var left2 = _getLeft(obj2);
            var top2 = _getTop(obj2);
            var height2 = obj2.height;
            var width2 = obj2.width;

            var checkpoints = [
                [_getLeft(obj1), _getTop(obj1)],
                [_getLeft(obj1) + obj1.width, _getTop(obj1)],
                [_getLeft(obj1) + obj1.width, _getTop(obj1) + obj1.height],
                [_getLeft(obj1), _getTop(obj1) + obj1.height]
            ];

            var len = checkpoints.length;
            for (var i = 0; i < len; i++) {
                var checkpoint = checkpoints[i];
                if (checkpoint[0] >= left2 && checkpoint[0] <= (left2 + width2)) {
                    if (checkpoint[1] >= top2 && checkpoint[1] <= (top2 + height2)) {
                        return true;
                    }
                }
            }

        } else {
            return false;
        }

        if (typeof reversed === 'undefined' || !reversed) {
            return _test(obj2, obj1, true);
        }

        return false;
    };
    
    return {
        'test': _test
    };
};