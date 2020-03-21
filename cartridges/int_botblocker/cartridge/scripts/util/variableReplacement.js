'use strict';

module.exports = function (template, variables) {
    const regex = new RegExp('\\$\\d', 'g');

    if (template === null) return '';

    return template.replace(regex, function (match) {
        const index = parseInt(match.substr(1), 10);
        const variable = variables[index - 1];

        return variable || '';
    });
};
