module.exports = function(handlebars, assigns) {
    handlebars.registerHelper('assignVar', function(variable) {

        if (typeof GLOBAL[variable] !== 'undefined') {
            switch (typeof GLOBAL[variable] )
            {
                case 'string':
                    return 'var ' + variable + ' = \'' + GLOBAL[variable] + '\';';
                default:
                    return 'var ' + variable + ' = ' + GLOBAL[variable].toString() + ';';
                    break;
            }

        } else if (typeof assigns[variable] !== 'undefined') {
            switch (typeof assigns[variable] )
            {
                case 'string':
                    return 'var ' + variable + ' = \'' + assigns[variable] + '\';';
                default:
                    return 'var ' + variable + ' = ' + assigns[variable].toString() + ';';
                    break;
            }

        } else {
            return 'var ' + variable + ' = null;';
        }
    });

    return handlebars;
};