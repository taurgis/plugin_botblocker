'use strict';

var userAgentParser = require('../util/regexParser').userAgentParser;
var variableReplacement = require('../util/variableReplacement');
var formatVersion = require('../util/version').formatVersion;
var parseBrowserEngineVersion = require('../util/version').parseBrowserEngineVersion;

var availableBrowsers = {
    '2B': '2345 Browser', 36: '360 Phone Browser', '3B': '360 Browser', AA: 'Avant Browser', AB: 'ABrowse', AF: 'ANT Fresco', AG: 'ANTGalio', AL: 'Aloha Browser', AH: 'Aloha Browser Lite', AM: 'Amaya', AO: 'Amigo', AN: 'Android Browser', AD: 'AOL Shield', AR: 'Arora', AV: 'Amiga Voyager', AW: 'Amiga Aweb', AT: 'Atomic Web Browser', AS: 'Avast Secure Browser', VG: 'AVG Secure Browser', BA: 'Beaker Browser', BM: 'Beamrise', BB: 'BlackBerry Browser', BD: 'Baidu Browser', BS: 'Baidu Spark', BI: 'Basilisk', BE: 'Beonex', BH: 'BlackHawk', BJ: 'Bunjalloo', BL: 'B-Line', BR: 'Brave', BK: 'BriskBard', BX: 'BrowseX', CA: 'Camino', CL: 'CCleaner', CC: 'Coc Coc', CD: 'Comodo Dragon', C1: 'Coast', CX: 'Charon', CE: 'CM Browser', CF: 'Chrome Frame', HC: 'Headless Chrome', CH: 'Chrome', CI: 'Chrome Mobile iOS', CK: 'Conkeror', CM: 'Chrome Mobile', CN: 'CoolNovo', CO: 'CometBird', CB: 'COS Browser', CP: 'ChromePlus', CR: 'Chromium', CY: 'Cyberfox', CS: 'Cheshire', CT: 'Crusta', CU: 'Cunaguaro', CV: 'Chrome Webview', DB: 'dbrowser', DE: 'Deepnet Explorer', DT: 'Delta Browser', DF: 'Dolphin', DO: 'Dorado', DL: 'Dooble', DI: 'Dillo', DD: 'DuckDuckGo Privacy Browser', EC: 'Ecosia', EI: 'Epic', EL: 'Elinks', EB: 'Element Browser', EZ: 'eZ Browser', EU: 'EUI Browser', EP: 'GNOME Web', ES: 'Espial TV Browser', FA: 'Falkon', FX: 'Faux Browser', F1: 'Firefox Mobile iOS', FB: 'Firebird', FD: 'Fluid', FE: 'Fennec', FF: 'Firefox', FK: 'Firefox Focus', FY: 'Firefox Reality', FR: 'Firefox Rocket', FL: 'Flock', FM: 'Firefox Mobile', FW: 'Fireweb', FN: 'Fireweb Navigator', FU: 'FreeU', GA: 'Galeon', GE: 'Google Earth', HA: 'Hawk Turbo Browser', HO: 'hola! Browser', HJ: 'HotJava', HU: 'Huawei Browser', IB: 'IBrowse', IC: 'iCab', I2: 'iCab Mobile', I1: 'Iridium', I3: 'Iron Mobile', I4: 'IceCat', ID: 'IceDragon', IV: 'Isivioo', IW: 'Iceweasel', IE: 'Internet Explorer', IM: 'IE Mobile', IR: 'Iron', JS: 'Jasmine', JI: 'Jig Browser', JO: 'Jio Browser', KB: 'K.Browser', KI: 'Kindle Browser', KM: 'K-meleon', KO: 'Konqueror', KP: 'Kapiko', KN: 'Kinza', KW: 'Kiwi', KY: 'Kylo', KZ: 'Kazehakase', LB: 'Cheetah Browser', LF: 'LieBaoFast', LG: 'LG Browser', LI: 'Links', LO: 'Lovense Browser', LU: 'LuaKit', LS: 'Lunascape', LX: 'Lynx', M1: 'mCent', MB: 'MicroB', MC: 'NCSA Mosaic', MZ: 'Meizu Browser', ME: 'Mercury', MF: 'Mobile Safari', MI: 'Midori', MO: 'Mobicip', MU: 'MIUI Browser', MS: 'Mobile Silk', MN: 'Minimo', MT: 'Mint Browser', MX: 'Maxthon', NB: 'Nokia Browser', NO: 'Nokia OSS Browser', NV: 'Nokia Ovi Browser', NX: 'Nox Browser', NE: 'NetSurf', NF: 'NetFront', NL: 'NetFront Life', NP: 'NetPositive', NS: 'Netscape', NT: 'NTENT Browser', OC: 'Oculus Browser', O1: 'Opera Mini iOS', OB: 'Obigo', OD: 'Odyssey Web Browser', OF: 'Off By One', OE: 'ONE Browser', OX: 'Opera GX', OG: 'Opera Neon', OH: 'Opera Devices', OI: 'Opera Mini', OM: 'Opera Mobile', OP: 'Opera', ON: 'Opera Next', OO: 'Opera Touch', OS: 'Ordissimo', OR: 'Oregano', OY: 'Origyn Web Browser', OV: 'Openwave Mobile Browser', OW: 'OmniWeb', OT: 'Otter Browser', PL: 'Palm Blazer', PM: 'Pale Moon', PP: 'Oppo Browser', PR: 'Palm Pre', PU: 'Puffin', PW: 'Palm WebPro', PA: 'Palmscape', PX: 'Phoenix', PO: 'Polaris', PT: 'Polarity', PS: 'Microsoft Edge', Q1: 'QQ Browser Mini', QQ: 'QQ Browser', QT: 'Qutebrowser', QZ: 'QupZilla', QM: 'Qwant Mobile', QW: 'QtWebEngine', RE: 'Realme Browser', RK: 'Rekonq', RM: 'RockMelt', SB: 'Samsung Browser', SA: 'Sailfish Browser', SC: 'SEMC-Browser', SE: 'Sogou Explorer', SF: 'Safari', SW: 'SalamWeb', SH: 'Shiira', S1: 'SimpleBrowser', SK: 'Skyfire', SS: 'Seraphic Sraf', SL: 'Sleipnir', SN: 'Snowshoe', SO: 'Sogou Mobile Browser', S2: 'Splash', SI: 'Sputnik Browser', SR: 'Sunrise', SP: 'SuperBird', SU: 'Super Fast Browser', S0: 'START Internet Browser', ST: 'Streamy', SX: 'Swiftfox', SZ: 'Seznam Browser', TO: 't-online.de Browser', TA: 'Tao Browser', TF: 'TenFourFox', TB: 'Tenta Browser', TZ: 'Tizen Browser', TS: 'TweakStyle', UB: 'UBrowser', UC: 'UC Browser', UM: 'UC Browser Mini', UT: 'UC Browser Turbo', UZ: 'Uzbl', VI: 'Vivaldi', VV: 'vivo Browser', VB: 'Vision Mobile Browser', WI: 'Wear Internet Browser', WP: 'Web Explorer', WE: 'WebPositive', WF: 'Waterfox', WH: 'Whale Browser', WO: 'wOSBrowser', WT: 'WeTab Browser', YA: 'Yandex Browser', YL: 'Yandex Browser Lite', XI: 'Xiino'
};
var browserFamilies = {
    'Android Browser': ['AN', 'MU'], 'BlackBerry Browser': ['BB'], Baidu: ['BD', 'BS'], Amiga: ['AV', 'AW'], Chrome: ['CH', 'BA', 'BR', 'CC', 'CD', 'CM', 'CI', 'CF', 'CN', 'CR', 'CP', 'DD', 'IR', 'RM', 'AO', 'TS', 'VI', 'PT', 'AS', 'TB', 'AD', 'SB', 'WP', 'I3', 'CV', 'WH', 'SZ', 'QW', 'LF', 'KW', '2B', 'CE', 'EC', 'MT', 'MS', 'HA', 'OC', 'MZ', 'BM', 'KN', 'SW', 'M1', 'FA', 'TA', 'AH', 'CL', 'SU', 'EU', 'UB', 'LO', 'VG'], Firefox: ['FF', 'FE', 'FM', 'SX', 'FB', 'PX', 'MB', 'EI', 'WF', 'CU', 'TF', 'QM', 'FR', 'I4', 'GZ', 'MO', 'F1', 'BI', 'MN', 'BH', 'TO', 'OS', 'FY'], 'Internet Explorer': ['IE', 'IM', 'PS'], Konqueror: ['KO'], NetFront: ['NF'], NetSurf: ['NE'], 'Nokia Browser': ['NB', 'NO', 'NV', 'DO'], Opera: ['OP', 'OM', 'OI', 'ON', 'OO', 'OG', 'OH', 'O1', 'OX'], Safari: ['SF', 'MF', 'SO'], 'Sailfish Browser': ['SA']
};
var mobileOnlyBrowsers = ['36', 'OC', 'PU', 'SK', 'MF', 'OI', 'OM', 'DD', 'DB', 'ST', 'BL', 'IV', 'FM', 'C1', 'AL', 'SA', 'SB', 'FR', 'WP', 'HA', 'NX', 'HU', 'VV', 'RE', 'CB', 'MZ', 'UM', 'FK', 'FX', 'WI', 'MN', 'M1', 'AH', 'SU', 'EU', 'EZ', 'UT', 'DT', 'S0'];

/**
 * Class to determine the browser used by the client.
 * @param {string} sUserAgent - The user agent string
 */
function Browser(sUserAgent) {
    this.source = sUserAgent;
}

Browser.prototype.getBrowserShortName = function (browserName) {
    var resultShortName = '';

    Object.keys(availableBrowsers).some(function (shortName) {
        var name = availableBrowsers[shortName];

        if (name === browserName) {
            resultShortName = shortName;

            return true;
        }

        return false;
    });

    return resultShortName;
};

Browser.prototype.getBrowserFamily = function (browserName) {
    var browserShortName = this.getBrowserShortName(browserName);
    var resultBrowsesrFamily = '';

    Object.keys(browserFamilies).some(function (browserFamily) {
        var browserLabels = browserFamilies[browserFamily];

        if (browserLabels.indexOf(browserShortName) >= 0) {
            resultBrowsesrFamily = browserFamily;

            return true;
        }

        return false;
    });

    return resultBrowsesrFamily;
};

Browser.prototype.isMobileOnlyBrowser = function (browserName) {
    return mobileOnlyBrowsers.indexOf(this.getBrowserShortName(browserName)) >= 0;
};

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
        var version = formatVersion(vrpVersion);
        var shortVersion = (version && parseFloat(formatVersion(vrpVersion))) || '';

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
