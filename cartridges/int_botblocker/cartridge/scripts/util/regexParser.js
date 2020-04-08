'use strict';

/**
 * Converts the user agent regex to a full regex instance.
 * @param {string} rawRegex - The base regex string for a specific user agent.
 *
 * @returns {RegExp} - The formed regular expression
 */
function getRegexInstance(rawRegex) {
    var regexInstance = RegExp('(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:' + rawRegex + ')', 'i');

    return regexInstance;
}

/**
 * Matches a user agent string with a regex.
 * @param {string} rawRegex - The regex string
 * @param {string} userAgent  - The user agent string
 *
 * @returns {[string]} - Returns the matched user agent string part
 */
function userAgentParser(rawRegex, userAgent) {
    try {
        var regexInstance = getRegexInstance(rawRegex);
        var match = regexInstance.exec(userAgent);

        return match ? match.slice(1) : null;
    } catch (e) {
        var Logger = require('dw/system/Logger');

        Logger.error('Something is wrong with regex: ' + rawRegex + ' for user agent ' + userAgent + '( ' + e + ')');
        return null;
    }
}

module.exports = {
    userAgentParser: userAgentParser
};
