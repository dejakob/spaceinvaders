define([], function() {
    var getQuery = function() {
        var urlQuery = {};
        var splitter = window.location.href.split('?');
        if (Object.keys(splitter).length > 1) {
            splitter = splitter[1].split('&');
            for(var i = 0; i < splitter.length; i++) {
                urlQuery[splitter[i].split('=')[0]] = splitter[i].split('=')[1];
            }
        }
        return urlQuery;
    };

    var paramsToString = function(params) {
        var str = '?';
        for (var i = 0; i < Object.keys(params).length; i++) {
            var k = Object.keys(params)[i];
            var v = params[k];
            str += k + '=' + v;

            if (i!==Object.keys(params).length-1) {
                str += '&';
            }
        }
        return str;
    };

    return {
        getQuery: getQuery,
        paramsToString: paramsToString
    }
});