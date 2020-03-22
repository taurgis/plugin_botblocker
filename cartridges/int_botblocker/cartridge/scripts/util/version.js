'use strict';

var trim = require('./trim');

module.exports = {
    formatVersion: function (version, versionTruncation) {
        if (version === undefined) return '';

        var versionString = trim(version, '. ').replace(new RegExp('_', 'g'), '.');
        var versionParts = versionString.split('.');

        // Return if the string is not only digits once we removed the dots
        if (!/^\d+$/.test(versionParts.join(''))) {
            return versionString;
        }

        if (versionTruncation !== 0) {
            if (parseFloat(versionString) % 1 === 0) {
                return parseInt(versionString, 10);
            }
        }

        if (versionParts.length > 1) {
            if (versionTruncation !== null) {
                return versionParts.slice(0, versionTruncation + 1).join('.');
            }
        }

        return versionString;
    },

    parseBrowserEngineVersion: function (userAgent, engine) {
        if (!engine) return '';

        var regex = new RegExp(engine + '\\s*\\/?\\s*((?:(?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))', 'i');
        var match = userAgent.match(regex);

        if (!match) return '';

        return match.pop();
    }
};
