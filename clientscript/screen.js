"use strict";

var Web = (function() {
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

            var _setLoader = function() {
                _viewLoader.attr('height', $(window).height());
                _viewLoader.attr('width', $(window).width());
            };

            $(window).on('resize', function() {Web.PatheticRenderer.runAll('resize')});

            return function() {
                _initMainMenu();
                _setLoader();
                Web.PatheticRenderer.add('resize', _setLoader);
            };
        })();

        init();
    });

    return {
        'PatheticRenderer': {
            'events': {},
            'add': function(on, ev) {
                if (typeof this.events[on] === 'undefined') {
                    this.events[on] = [ev];
                } else {
                    this.events[on].push(ev);
                }
            },
            'runAll': function(val) {
                if (typeof this.events[val] !== 'undefined') {
                    var v = this.events[val];
                    var len = v.length;
                    for (var i = 0; i < len; i++) {
                        v[i]();
                    }
                }
            }
        }
    }
})();