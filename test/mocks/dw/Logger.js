'use strict';

module.exports = {
    getLogger: function () {
        return {
            debug: function () {},
            warn: function () {},
            error: function (message) {
                // eslint-disable-next-line no-console
                console.log(message);
            }
        };
    }
};
