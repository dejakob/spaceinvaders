var _cachedLocation = null;

define([
    'lib/geo.js',
    'lib/jquery.js'
], function() {
    return function(cb) {
        if (_cachedLocation !== null) {
            cb(_cachedLocation);
            return;
        }

        if (geo_position_js.init()) {
            var locationReceived = function (data) {
                var d = {
                    'latitude': data.coords.latitude,
                    'longitude': data.coords.longitude
                };
                _cachedLocation = d;
                cb(d)
            };
            geo_position_js.getCurrentPosition(function(data) {
                    locationReceived(data);
                },
                function () {
                    try {
                        navigator.geolocation.getCurrentPosition(function(data) {
                            locationReceived(data);
                        }, function(err) {
                            console.log(err.message);
                        });
                    }
                    catch (ex) {
                    }
                });
        }
        else {
            try {
                navigator.geolocation.getCurrentPosition(function(data) {
                    locationReceived(data);
                }, function(err) {console.log(err.message)});
            }
            catch (ex) {
            }
        }
    };

});