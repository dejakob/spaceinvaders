define([
    "lib/react.js",
    "phone/views/login.rt.js"
], function(React, LoginView) {
    var screenWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
    var screenHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;
    var content = document.getElementById('content');
    var phoneTitle = $('#phoneTitle');

    //Render login view
    LoginView = React.createFactory(LoginView);
    React.render(LoginView(), content);

    //init
    var initTransform = function() {
        var css = "transform-origin: " + screenWidth / 2 + "px " + screenWidth / 2 + "px;";
        css += "-webkit-transform-origin: " + screenWidth / 2 + "px " + screenWidth / 2 + "px;";
        css += "-moz-transform-origin: " + screenWidth / 2 + "px " + screenWidth / 2 + "px;";
        css += "height: " + screenWidth + "px;";
        css += "width: " + screenHeight + "px;";
        content.setAttribute("style", css);
    };
    initTransform();
});