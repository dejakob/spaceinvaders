var LocalStorage = {
    browserSupports: function() {
        try {
            if(window.localStorage) {
                return window.localStorage;
            }
            return null;
        } catch (e) {return null;}
    },
    load: function(key) {
        if(this.browserSupports()!=null) {
            return eval(this.browserSupports().getItem(key));
        }
        var cookieVal = getCookie();
        if(cookieVal!=null) {
            return eval(cookieVal);
        }
        return null;
        function getCookie() {
            var name = key + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++)
            {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return null;
        }
    },
    save: function(key, val) {
        if(this.browserSupports()!=null) {
            this.browserSupports().setItem(key, JSON.stringify(val));
        }
        else {
            setCookie();
        }
        return null;
        function setCookie() {
            var d = new Date();
            d.setTime(d.getTime()+(100*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = key + "=" + JSON.stringify(val) + "; " + expires;
        }
    }
};