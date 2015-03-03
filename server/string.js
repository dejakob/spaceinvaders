String.prototype.ltrim = function(spl) {
    var regex = new RegExp('^\\' + spl + '+');
    return this.replace(regex,'');
};
String.prototype.rtrim = function(spl) {
    var regex = new RegExp('\\' + spl + '+$');
    return this.replace(regex,'');
};
String.prototype.ucfirst = function() {
    var f = this.charAt(0).toUpperCase();
    return f + this.substr(1);
};
String.prototype.startsWith = function(spl) {
    var regex = new RegExp('^\\' + spl + '+');
    return (this.replace(regex,'')!==this.toString());
};
String.prototype.endsWith = function(spl) {
    var regex = new RegExp('\\' + spl + '+$');
    return (this.replace(regex,'')!==this.toString());
};
String.prototype.getExtension = function() {
    var dotSplit = this.split('.');
    var ext = dotSplit[dotSplit.length - 1];
    ext = ext.split('?')[0];
    return ext;
};
String.prototype.ucfirst = function() {
    var str = this;
    var f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
};