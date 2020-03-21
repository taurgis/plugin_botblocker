'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
var cUACache = CacheMgr.getCache('bbUserAgent');
var userAgentParser = require('../util/regexParser').userAgentParser;
var OperatingSystem = require('./os');

/**
 * The User Agent processing class
 *
 * @param {string} sUserAgent - The user agent string to process
 */
function UserAgent(sUserAgent) {
    this.source = sUserAgent;
    this.parsed = false;
    this.isKnownBot = false;
    this.bot = null;
    this.os = null;
}

/**
 * This function parses the User Agent string and detects what type of browser
 * is sending requests to the server (e.g. a bot, TV, computer, tablet, mobile, ...)
 *
 * Once a useragent has been processed, it will be cached to speed up subsequent requests
 * using the same type of browser.
 */
UserAgent.prototype.parse = function () {
    if (this.source) {
        var cachedParseResult = cUACache.get(this.source);

        if (cachedParseResult) {
            bbLogger.log('Fetching UserAgent from cache.', 'debug', 'UserAgent~parse');
            this.bot = cachedParseResult.bot;
            this.isKnownBot = cachedParseResult.isKnownBot;
            this.os = cachedParseResult.os;
        } else {
            this.determineBotData();
            this.determineOS();

            cUACache.put(this.source, this);
            bbLogger.log('UserAgent calculated and cached.', 'debug', 'UserAgent~parse');
        }
    }

    this.parsed = true;
};

UserAgent.prototype.determineOS = function () {
    var oOperatingSystem = new OperatingSystem(this.source);
    this.os = oOperatingSystem.parse();
};

/**
 * Checks wether or not the User Agent is a known bot like Google Mobile bot,
 * Bing, ... If these are sending request, they usually abide by the rules and
 * will not trigger a request limit.
 */
UserAgent.prototype.determineBotData = function () {
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

    this.isKnownBot = !!this.bot;
};

/**
 * Returns wether or not the User Agent string is safe or not.
 * If we cannot detect what it is, it usally means its malicous.
 *
 * @returns {boolean} - Safe or not
 */
UserAgent.prototype.isSafe = function () {
    return this.isKnownBot || !empty(this.os.name);
};

module.exports = UserAgent;
