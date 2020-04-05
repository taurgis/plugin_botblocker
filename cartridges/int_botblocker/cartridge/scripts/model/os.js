/* eslint-disable no-useless-escape */

'use strict';

var userAgentParser = require('../util/regexParser').userAgentParser;
var variableReplacement = require('../util/variableReplacement');
var formatVersion = require('../util/version').formatVersion;

/**
 * Class to determine the OS used by the client.
 * @param {string} sUserAgent - The user agent string
 */
function OS(sUserAgent) {
    this.source = sUserAgent;
}

OS.prototype.parse = function () {
    var operatingSystems = require('./regex/os.json');
    var sUserAgent = this.source;

    var result = {
        name: '',
        version: '',
        platform: this.parsePlatform(this.source)
    };

    operatingSystems.some(function (operatingSystem) {
        var match = userAgentParser(operatingSystem.regex, sUserAgent);

        if (!match) return false;

        result.name = variableReplacement(operatingSystem.name, match);
        result.version = formatVersion(variableReplacement(operatingSystem.version, match));

        if (result.name === 'lubuntu') {
            result.name = 'Lubuntu';
        }

        if (result.name === 'debian') {
            result.name = 'Debian';
        }

        if (result.name === 'YunOS') {
            result.name = 'YunOs';
        }

        return true;
    });

    return result;
};

OS.prototype.parsePlatform = function (userAgent) {
    if (userAgentParser('arm', userAgent)) {
        return 'ARM';
    }

    if (userAgentParser('WOW64|x64|win64|amd64|x86_64', userAgent)) {
        return 'x64';
    }

    if (userAgentParser('i[0-9]86|i86pc', userAgent)) {
        return 'x86';
    }

    return '';
};

module.exports = OS;
