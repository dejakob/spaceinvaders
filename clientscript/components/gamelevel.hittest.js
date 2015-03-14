"use strict";

var Hittest = function(scope) {
    
    var _test = function(obj1, obj2) {
        if (typeof obj1 !== 'undefined' && typeof obj2 !== 'undefined') {
            var topa1, topa2, lefta1, lefta2;
            var topb1, topb2, leftb1, leftb2;
            
            if (obj1.top) {
                topa1 = obj1.top;
                topa2 = obj1.top + obj1.height;
            } else if (obj1.bottom) {
                topa1 = (scope.height - obj1.bottom) - obj1.height;
                topa2 = (scope.height - obj1.bottom);
            }
            
            if (obj2.top) {
                topb1 = obj2.top;
                topb2 = obj2.top + obj2.height;
            } else if (obj2.bottom) {
                topb1 = (scope.height - obj2.bottom) - obj2.height;
                topb2 = (scope.height - obj2.bottom);
            }
            
            if (obj1.left) {
                lefta1 = obj1.left;
                lefta2 = obj1.left + obj1.width;
            } else if (obj1.right) {
                lefta1 = (scope.width - obj1.right) - obj1.width;
                lefta2 = (scope.width - obj1.right);
            }
            
            if (obj2.left) {
                leftb1 = obj2.left;
                leftb2 = obj2.left + obj2.width;
            } else if (obj2.right) {
                leftb1 = (scope.width - obj2.right) - obj2.width;
                leftb2 = (scope.width - obj2.right);
            }

            if ((topa1 >= topb1 && topa2 <= topb2) && (lefta1 >= leftb1 && lefta2 <= leftb2)) {
                return true;
            }

            if ((topa1 <= topb1 && topa2 >= topb2) && (lefta1 <= leftb1 && lefta2 >= leftb2)) {
                return true;
            }
            
            return false;
        }
    };
    
    return {
        'test': _test
    };
};