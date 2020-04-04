'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('useragent', function () {
    var UserAgentModel = proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/model/useragent', {
        'dw/system/CacheMgr': require('../../../../../mocks/dw/CacheMgr'),
        '../util/BBLogger': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/util/BBLogger', {
            'dw/system/Logger': require('../../../../../mocks/dw/Logger')
        }),
        '../util/regexParser': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/util/regexParser', {
            'dw/system/CacheMgr': require('../../../../../mocks/dw/CacheMgr')
        }),
        './browser': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/model/browser', {
            '../util/regexParser': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/util/regexParser', {
                'dw/system/CacheMgr': require('../../../../../mocks/dw/CacheMgr')
            })
        }),
        './os': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/model/browser', {
            '../util/regexParser': proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/util/regexParser', {
                'dw/system/CacheMgr': require('../../../../../mocks/dw/CacheMgr')
            })
        })
    });

    global.empty = function (val) {
        return val !== null && val.length;
    };

    it('should save the User Agent string as its source and set all known items to false.', function () {
        var sUserAgentString = '123';
        var result = new UserAgentModel(sUserAgentString);

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, false);
        assert.equal(result.isKnownBrowser, false);
        assert.equal(result.isKnownLibrary, false);
    });


    it('should parse a browser correctly. - Chrome', function () {
        var sUserAgentString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';
        var result = new UserAgentModel(sUserAgentString);
        result.parse();

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, false);
        assert.equal(result.isKnownBrowser, true);
        assert.equal(result.isKnownLibrary, false);
        assert.equal(result.browser.name, 'Chrome');
        assert.equal(result.browser.version, '80.0.3987.149');
        assert.equal(result.browser.engine, 'WebKit');
    });


    it('should parse a browser correctly. - Opera (Android)', function () {
        var sUserAgentString = 'Opera/9.80 (Android 2.2.1; Linux; Opera Tablet/ADR-1301080958) Presto/2.11.355 Version/12.10';
        var result = new UserAgentModel(sUserAgentString);
        result.parse();

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, false);
        assert.equal(result.isKnownBrowser, true);
        assert.equal(result.isKnownLibrary, false);
        assert.equal(result.browser.name, 'Opera Mobile');
        assert.equal(result.browser.version, '12.10');
        assert.equal(result.browser.engine, 'Presto');
    });

    it('should parse a browser correctly. - Opera (Desktop)', function () {
        var sUserAgentString = 'Opera/9.27 (Windows NT 5.1; U; de)';
        var result = new UserAgentModel(sUserAgentString);
        result.parse();

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, false);
        assert.equal(result.isKnownBrowser, true);
        assert.equal(result.isKnownLibrary, false);
        assert.equal(result.browser.name, 'Opera');
        assert.equal(result.browser.version, '9.27');
    });

    it('should parse a browser correctly. - Android browser (Android)', function () {
        var sUserAgentString = 'Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; F-05E….30 (KHTML, like Gecko) Version/4.0 Safari/534.30';
        var result = new UserAgentModel(sUserAgentString);
        result.parse();

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, false);
        assert.equal(result.isKnownBrowser, true);
        assert.equal(result.isKnownLibrary, false);
        assert.equal(result.browser.name, 'Android Browser');
        assert.equal(result.browser.engine, 'WebKit');
    });

    it('should parse a bot correctly. - Screaming Frog', function () {
        var sUserAgentString = 'Screaming Frog SEO Spider/2.22';
        var result = new UserAgentModel(sUserAgentString);
        result.parse();

        assert.equal(result.source, sUserAgentString);
        assert.equal(result.isKnownBot, true);
        assert.equal(result.isKnownBrowser, false);
        assert.equal(result.isKnownLibrary, false);
        assert.equal(result.bot.name, 'Screaming Frog SEO Spider');
        assert.equal(result.bot.category, 'Crawler');
    });
});
