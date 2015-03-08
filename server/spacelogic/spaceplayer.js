module.exports = function() {
    var _name;
    var _id;
    var _hash;

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
        }
    };
};