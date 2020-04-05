'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var bbLogger = require('../util/BBLogger');
var cUACache = CacheMgr.getCache('bbUserAgent');
var userAgentParser = require('../util/regexParser').userAgentParser;
var OperatingSystem = require('./os');
var Browser = require('./browser');

/**
 * The User Agent processing class
 *
 * @param {string} sUserAgent - The user agent string to process
 */
function UserAgent(sUserAgent) {
    this.source = sUserAgent;
    this.isKnownBot = false;
    this.isKnownBrowser = false;
    this.isKnownLibrary = false;
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
            this.browser = cachedParseResult.browser;
            this.isKnownBrowser = cachedParseResult.isKnownBrowser;
            this.library = cachedParseResult.library;
            this.isKnownLibrary = cachedParseResult.isKnownLibrary;
        } else {
            this.determineBotData();

            if (!this.isKnownBot) {
                delete this.bot;

                this.determineBrowser();

                if (!this.isKnownBrowser) {
                    delete this.browser;
                    this.determineLibraryData();
                }

                if (this.isKnownBrowser || this.isKnownLibrary) {
                    this.determineOS();
                }
            }

            cUACache.put(this.source, this);
            bbLogger.log('UserAgent calculated and cached.', 'debug', 'UserAgent~parse');
        }
    }
};

UserAgent.prototype.determineOS = function () {
    var oOperatingSystem = new OperatingSystem(this.source);
    this.os = oOperatingSystem.parse();
};

UserAgent.prototype.determineBrowser = function () {
    var oBrowser = new Browser(this.source);
    this.browser = oBrowser.parse();
    this.isKnownBrowser = !!this.browser.name;
};

/**
 * Checks wether or not the User Agent is a known bot like Google Mobile bot,
 * Bing, ... If these are sending request, they usually abide by the rules and
 * will not trigger a request limit.
 */
UserAgent.prototype.determineBotData = function () {
    var bots = require('./regex/bots.json');
    var sSource = this.source;
    var resultBot;

    bots.some(function (bot) {
        var match = userAgentParser(bot.regex, sSource);

        if (!match) { return false; }

        resultBot = {
            name: bot.name,
            category: bot.category || '',
            url: bot.url || '',
            producer: {
                name: (bot.producer && bot.producer.name) || '',
                url: (bot.producer && bot.producer.url) || ''
            }
        };


        return true;
    });

    if (resultBot) {
        this.bot = resultBot;
    }

    this.isKnownBot = !!this.bot;
};

/**
 * Checks wether or not the User Agent is a known library like wget,
 * Guzzle, ... If these are sending request and passing the limit, it
 * is someone doing something they shouldn't be doing.
 */
UserAgent.prototype.determineLibraryData = function () {
    var libraries = require('./regex/libraries.json');
    var variableReplacement = require('../util/variableReplacement');
    var formatVersion = require('../util/version').formatVersion;
    var sUserAgent = this.source;

    var result = {
        type: '',
        name: '',
        version: '',
        url: ''
    };

    libraries.some(function (library) {
        const match = userAgentParser(library.regex, sUserAgent);

        if (!match) return false;

        result.type = 'library';
        result.name = variableReplacement(library.name, match);
        result.version = formatVersion(variableReplacement(library.version, match));
        result.url = library.url || '';

        return true;
    });


    if (result.name) {
        this.library = result;
    }

    this.isKnownLibrary = !!this.library;
};

/**
 * Returns wether or not the User Agent string is safe or not.
 * If we cannot detect what it is, it usally means its malicous.
 *
 * @returns {boolean} - Safe or not
 */
UserAgent.prototype.isSafe = function () {
    return !this.isKnownLibrary && (this.isKnownBot || !empty(this.os.name) || this.isKnownBrowser);
};

module.exports = UserAgent;
