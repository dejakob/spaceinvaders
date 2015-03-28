var RotateDevice = (function() {
    var _listeners = [];
    var _alphaListeners = [];
    var _betaListeners = [];
    var _gammaListeners = [];


    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(e) {
            if (_listeners.length || _alphaListeners.length || _betaListeners.length || _gammaListeners.length) {
                var listener, i;
                //DEGREES ARE NOT CLOCKWISE!
                var len = _listeners.length;
                var a, b, c;
                if (Math.abs(e.alpha) > 1) a = e.alpha; else a = null;
                if (Math.abs(e.beta) > 1) b = e.beta; else b = null;
                if (Math.abs(e.gamma) > 1) c = e.gamma; else c = null;

                for (i = 0; i < len; i++) {
                    listener = _listeners[i];
                    if (a !== null || b !== null || c !== null)
                        listener(a,b,c);
                }

                for (i = 0; i < _alphaListeners.length; i++) {
                    listener = _alphaListeners[i];
                    if (a !== null) {
                        listener(a);
                    }
                }

                for (i = 0; i < _betaListeners.length; i++) {
                    listener = _betaListeners[i];
                    if (b !== null) {
                        listener(b);
                    }
                }

                for (i = 0; i < _gammaListeners.length; i++) {
                    listener = _gammaListeners[i];
                    if (c !== null) {
                        listener(c);
                    }
                }
            }
        });
    }

    return {
        addListener: function(func) {
            _listeners.push(func);
        },
        addAlphaListener: function(func) {
            _alphaListeners.push(func);
        },
        addBetaListener: function(func) {
            _betaListeners.push(func);
        },
        addGammaListener: function(func) {
            _gammaListeners.push(func);
        }
    };
})();