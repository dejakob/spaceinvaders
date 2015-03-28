define([
    "lib/react.js",
    "phone/views/game.rt.js",
    "lib/jquery.js"
], function(React, GameView) {
    var screenWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
    var screenHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;
    var content = document.getElementById('content');
    var phoneTitle = $('#phoneTitle');

    //Render login view
    GameView = React.createFactory(GameView);
    React.render(GameView(), content);

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