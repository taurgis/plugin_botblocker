'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cUACache = CacheMgr.getCache('bbUserAgent');
var cRegexCache = CacheMgr.getCache('bbRegex');

/**
 * Generates a regex instance for a regex string.
 *
 * @param {*} rawRegex - The regex to instantiate
 * @returns {RegExp} - The regex instance
 */
function getRegexInstance(rawRegex) {
    const cachedRegexInstance = cRegexCache.get(rawRegex);

    if (cachedRegexInstance) return cachedRegexInstance.value;

    const regexInstance = RegExp('(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:' + rawRegex + ')', 'i');

    cRegexCache.put(rawRegex, {
        value: regexInstance
    });

    return regexInstance;
}

/**
 * Check if there is a user agent match
 *
 * @param {string} rawRegex - The regex
 * @param {string} userAgent - The user agent
 *
 * @returns {Object} - The match
 */
function userAgentParser(rawRegex, userAgent) {
    // TODO: find out why it fails in some browsers
    try {
        const regexInstance = getRegexInstance(rawRegex);
        const match = regexInstance.exec(userAgent);

        return match ? match.slice(1) : null;
    } catch (e) {
        return null;
    }
}


/**
 * The User Agent processing class
 *
 * @param {string} sUserAgent - The user agent string to process
 */
function UserAgent(sUserAgent) {
    this.source = sUserAgent;
    this.result = null;
}

UserAgent.prototype.parse = function () {
    var cachedParseResult = cUACache.get(this.source);

    if (!cachedParseResult) {
        this.checkIfBot();
    }
};

UserAgent.prototype.checkIfBot = function () {
    var bots = require('./regex/bots.json');

    bots.some(function (bot) {
        const match = userAgentParser(bot.regex, this.source);

        if (!match) { return false; }

        this.bot = {
            name: bot.name,
            category: bot.category || '',
            url: bot.url || '',
            producer: {
                name: bot.producer.name || '',
                url: bot.producer.url || ''
            }
        };


        return true;
    });

    this.isBot = !!this.bot;
};

module.exports = UserAgent;
