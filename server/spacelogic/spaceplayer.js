module.exports = function() {
    var _name;
    var _id;
    var _hash;
    var _onPhone;
    var _onScreen;

    return {
        get name() {
            return _name;
        },
        set name(val) {
            _name = val;
        },
        get id() {
            return _id;
        },
        set id(val) {
            _id = val;
        },
        get hash() {
            return _hash;
        },
        set hash(val) {
            _hash = val;
        },
        get onPhone() {
            return _onPhone;
        },
        set onPhone(val) {
            _onPhone = val;
        },
        get onScreen() {
            return _onScreen;
        },
        set onScreen(val) {
            _onScreen = val;
        }
    };
};