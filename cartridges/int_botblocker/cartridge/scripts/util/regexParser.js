'use strict';

var getRegexInstance = function (rawRegex) {
    var regexInstance = RegExp('(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:' + rawRegex + ')', 'i');

    return regexInstance;
};

var userAgentParser = function (rawRegex, userAgent) {
    // TODO: find out why it fails in some browsers
    try {
        var regexInstance = getRegexInstance(rawRegex);
        var match = regexInstance.exec(userAgent);

        return match ? match.slice(1) : null;
    } catch (e) {
        var Logger = require('dw/system/Logger');

        Logger.error('Something is wrong with regex: ' + rawRegex + ' for user agent ' + userAgent + '( ' + e + ')');
        return null;
    }
};

module.exports = {
    userAgentParser: userAgentParser
};
