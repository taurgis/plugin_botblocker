'use strict';

module.exports = function (template, variables) {
    var regex = new RegExp('\\$\\d', 'g');

    if (template === null) return '';

    var returnTemplate = template.replace(regex, function (match) {
        var index = parseInt(match.substr(1), 10);
        var variable = variables[index - 1];

        return variable || '';
    });

    return returnTemplate;
};
