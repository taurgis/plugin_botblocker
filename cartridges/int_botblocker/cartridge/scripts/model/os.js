/* eslint-disable no-useless-escape */

'use strict';

var shortOsNames = {
    AIX: 'AIX', AND: 'Android', AMG: 'AmigaOS', ATV: 'Apple TV', ARL: 'Arch Linux', BTR: 'BackTrack', SBA: 'Bada', BEO: 'BeOS', BLB: 'BlackBerry OS', QNX: 'BlackBerry Tablet OS', BMP: 'Brew', CES: 'CentOS', COS: 'Chrome OS', CYN: 'CyanogenMod', DEB: 'Debian', DFB: 'DragonFly', FED: 'Fedora', FOS: 'Firefox OS', FIR: 'Fire OS', BSD: 'FreeBSD', GNT: 'Gentoo', GTV: 'Google TV', HPX: 'HP-UX', HAI: 'Haiku OS', IRI: 'IRIX', INF: 'Inferno', KOS: 'KaiOS', KNO: 'Knoppix', KBT: 'Kubuntu', LIN: 'GNU\/Linux', LBT: 'Lubuntu', VLN: 'VectorLinux', MAC: 'Mac', MAE: 'Maemo', MDR: 'Mandriva', SMG: 'MeeGo', MCD: 'MocorDroid', MIN: 'Mint', MLD: 'MildWild', MOR: 'MorphOS', NBS: 'NetBSD', MTK: 'MTK \/ Nucleus', WII: 'Nintendo', NDS: 'Nintendo Mobile', OS2: 'OS\/2', T64: 'OSF1', OBS: 'OpenBSD', ORD: 'Ordissimo', PSP: 'PlayStation Portable', PS3: 'PlayStation', RHT: 'Red Hat', ROS: 'RISC OS', REM: 'Remix OS', RZD: 'RazoDroiD', SAB: 'Sabayon', SSE: 'SUSE', SAF: 'Sailfish OS', SLW: 'Slackware', SOS: 'Solaris', SYL: 'Syllable', SYM: 'Symbian', SYS: 'Symbian OS', S40: 'Symbian OS Series 40', S60: 'Symbian OS Series 60', SY3: 'Symbian^3', TDX: 'ThreadX', TIZ: 'Tizen', UBT: 'Ubuntu', WTV: 'WebTV', WIN: 'Windows', WCE: 'Windows CE', WIO: 'Windows IoT', WMO: 'Windows Mobile', WPH: 'Windows Phone', WRT: 'Windows RT', XBX: 'Xbox', XBT: 'Xubuntu', YNS: 'YunOs', IOS: 'iOS', POS: 'palmOS', WOS: 'webOS'
};
var osFamilies = {
    Android: ['AND', 'CYN', 'FIR', 'REM', 'RZD', 'MLD', 'MCD', 'YNS'], AmigaOS: ['AMG', 'MOR'], 'Apple TV': ['ATV'], BlackBerry: ['BLB', 'QNX'], Brew: ['BMP'], BeOS: ['BEO', 'HAI'], 'Chrome OS': ['COS'], 'Firefox OS': ['FOS', 'KOS'], 'Gaming Console': ['WII', 'PS3'], 'Google TV': ['GTV'], IBM: ['OS2'], iOS: ['IOS'], 'RISC OS': ['ROS'], 'GNU\/Linux': ['LIN', 'ARL', 'DEB', 'KNO', 'MIN', 'UBT', 'KBT', 'XBT', 'LBT', 'FED', 'RHT', 'VLN', 'MDR', 'GNT', 'SAB', 'SLW', 'SSE', 'CES', 'BTR', 'SAF', 'ORD'], Mac: ['MAC'], 'Mobile Gaming Console': ['PSP', 'NDS', 'XBX'], 'Real-time OS': ['MTK', 'TDX'], 'Other Mobile': ['WOS', 'POS', 'SBA', 'TIZ', 'SMG', 'MAE'], Symbian: ['SYM', 'SYS', 'SY3', 'S60', 'S40'], Unix: ['SOS', 'AIX', 'HPX', 'BSD', 'NBS', 'OBS', 'DFB', 'SYL', 'IRI', 'T64', 'INF'], WebTV: ['WTV'], Windows: ['WIN'], 'Windows Mobile': ['WPH', 'WMO', 'WCE', 'WRT', 'WIO']
};

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


OS.prototype.getOsFamily = function (osName) {
    var osShortName = this.getOsShortName(osName);
    var osFamilyResult = '';

    Object.keys(osFamilies).some(function (osFamily) {
        var shortNames = osFamilies[osFamily];

        if (shortNames.indexOf(osShortName) >= 0) {
            osFamilyResult = osFamily;

            return true;
        }

        return false;
    });

    return osFamilyResult;
};


OS.prototype.getOsShortName = function (osName) {
    var shortNameResult = '';
    Object.keys(shortOsNames).some(function (osShortName) {
        if (shortOsNames[osShortName] === osName) {
            shortNameResult = osShortName;

            return true;
        }

        return false;
    });

    return shortNameResult;
};


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
