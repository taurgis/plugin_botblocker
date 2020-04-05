'use strict';

var userAgentParser = require('../util/regexParser').userAgentParser;
var variableReplacement = require('../util/variableReplacement');
var formatVersion = require('../util/version').formatVersion;
var parseBrowserEngineVersion = require('../util/version').parseBrowserEngineVersion;

/**
 * Class to determine the browser used by the client.
 * @param {string} sUserAgent - The user agent string
 */
function Browser(sUserAgent) {
    this.source = sUserAgent;
}

Browser.prototype.parse = function () {
    var browsers = require('./regex/browsers.json');
    var sUserAgent = this.source;

    var result = {
        type: '',
        name: '',
        version: '',
        engine: '',
        engineVersion: ''
    };

    browsers.some(function (browser) {
        var match = userAgentParser(browser.regex, sUserAgent);

        if (!match) return false;

        var vrpVersion = variableReplacement(browser.version, match);
        var version = vrpVersion;
        var shortVersion = (version && parseFloat(vrpVersion)) || '';

        if (browser.engine) {
            result.engine = browser.engine.default;

            if (browser.engine && browser.engine.versions && shortVersion) {
                var sortedEngineVersions = Object.keys(browser.engine.versions).sort(function (a, b) {
                    return parseFloat(a) > parseFloat(b) ? 1 : -1;
                });

                sortedEngineVersions.some(function (versionThreshold) {
                    var engineByVersion = sortedEngineVersions[versionThreshold];

                    if (parseFloat(versionThreshold) <= shortVersion) {
                        result.engine = engineByVersion;

                        return true;
                    }

                    return false;
                });
            }
        }

        result.type = 'browser';
        result.name = variableReplacement(browser.name, match);
        result.version = version;

        return true;
    });

    if (!result.engine) {
        var browserEngines = require('./regex/browser_engine.json');
        browserEngines.some(function (browserEngine) {
            var match = RegExp(browserEngine.regex, 'i').exec(sUserAgent);

            if (!match) return false;

            result.engine = browserEngine.name;
            return true;
        });
    }

    result.engineVersion = formatVersion(parseBrowserEngineVersion(this.source, result.engine));

    return result;
};

module.exports = Browser;
