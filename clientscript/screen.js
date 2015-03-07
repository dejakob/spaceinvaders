"use strict";

var Web = (function Web() {
    var _body;
    var _homeArticle;
    var _mainMenu;
    var _viewLoader;

    require([
        "lib/qrcode.js",
        "lib/jquery.js"
    ], function() {
        _body = $('body');
        _homeArticle = _body.find('#home');
        _mainMenu = _homeArticle.find('#main');
        _viewLoader = _body.find('view-loader');

        var init = (function() {
            var _initMainMenu = function() {
                var _events = {
                    itemClick: function(event) {
                        var item = this;
                        _homeArticle.addClass('hide');

                        setTimeout(function() {
                            _homeArticle.hide();
                            _viewLoader.attr('view', $(item).data('view'));

                        }, 1000);
                    }
                };

                _mainMenu.delegate('>li', 'click', _events.itemClick)
            };

            return function() {
                _initMainMenu();
            };
        })();

        init();
    });


    return {
        'PatheticRenderer': {
            'functions': [],
            'reinit': function() {
                for (var i = 0; i < this.functions.length; i++) {
                    var func = this.functions[i];
                    func();
                }
            }
        }
    }
})();