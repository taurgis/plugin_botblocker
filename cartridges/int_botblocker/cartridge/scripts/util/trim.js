'use strict';

module.exports = function (str, char) {
    return str.replace(new RegExp(
        '^[' + char + ']+|[' + char + ']+$', 'g'
    ), '');
};
