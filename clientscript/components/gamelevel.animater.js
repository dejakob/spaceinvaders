var Animater = function(scope) {
    var _animations = [];

    var cache = (function() {
        var _cache = {};

        return {
            'get': function(selector) {
                if (typeof _cache[selector] !== 'undefined') {
                    return _cache[selector];
                }

                _cache[selector] = $(scope.shadowRoot.querySelector(selector));
                return _cache[selector];
            }
        };
    })();

    return {
       'addAnimation': function(animation) {
            _animations.push(animation);
       },
       'tick': function(tickCount) {
           for (var i = 0; i < _animations.length; i++) {
               var animation = _animations[i];

               if (tickCount === animation.start) {
                   if (animation.type === 'fade') {
                       //TODO implement
                   } else if (animation.type === 'tiktak') {
                       animation.element = cache.get(animation.selector);
                       animation.off = animation.element.attr('style');
                       animation.on = animation.css;
                       animation.tak = false;
                   }
               } else if (tickCount >= animation.end) {
                   if (animation.type === 'tiktak') {
                       animation.element.attr('style', animation.off);
                   } else {

                   }
                   _animations.splice(i);
               } else if ((tickCount - animation.start) % animation.interval === 0) {
                   try {
                       if (animation.type === 'tiktak') {
                           animation.tak = !animation.tak;
                           if (animation.tak) {
                               animation.element.css(animation.on);
                           } else {
                               animation.element.attr('style', animation.off);
                           }
                       } else if (animation.type === 'fade') {

                       }
                   } catch (ex) {
                       console.log(ex, 'animation stopped');
                       _animations.splice(i);
                   }
               }
           }
       },
       'end': function() {
           for (var i = 0; i < _animations.length; i++) {
               var animation = _animations[i];
               console.log('ANIMATION END', animation);
               if (animation.type === 'tiktak') {
                   animation.element.attr('style', animation.off);
                   console.log('animation.element.attr',animation.element.attr('style') )
               }
           }
       }
    };
};