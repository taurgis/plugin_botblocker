'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cBlackListCache = CacheMgr.getCache('bbBlacklisted');

/**
 * Registers the threshold functions for handeling requests.
 *
 * @param {Object} oIPAddress - The IP address object to register the functions to
 * @param {string} sIPAddress  - The current request IP address
 * @param {Object} oUserAgent - The user agent object for the current request
 */
function registerThresholds(oIPAddress, sIPAddress, oUserAgent) {
    var BBConfig = require('../models/system/config');
    var bbLogger = require('./util/BBLogger');

    if (oIPAddress.count > (BBConfig.firstBlockThreshold * 0.75)) {
        oIPAddress.registerThreshold(BBConfig.secondBlockThreshold, function () {
            bbLogger.log(sIPAddress + ' reached second threshold.', 'error', 'Blocker~validate');

            cBlackListCache.put(sIPAddress, true);

            oUserAgent.parse();
            oIPAddress.blacklist(oUserAgent);

            return true;
        });

        oIPAddress.registerThreshold(BBConfig.firstBlockThreshold, function () {
            bbLogger.log(sIPAddress + ' reached first threshold.', 'debug', 'Blocker~validate');

            oUserAgent.parse();

            if (!oUserAgent.isSafe()) {
                cBlackListCache.put(sIPAddress, true);
                oIPAddress.blacklist(oUserAgent);

                return true;
            }

            return false;
        });
    }
}

/**
 * Constructs the IP Address object based on the request IP.
 * @param {string} sIPAddress - The IP address of the request
 * @param {Object} oUserAgent - The User Agent object
 * @returns {Object} - The IP address object
 */
function constructIPAddress(sIPAddress, oUserAgent) {
    var IPAddress = require('../models/session/ipaddress');
    var ipRequestCache = CacheMgr.getCache('bbIPRequest');
    var oIPAddress = ipRequestCache.get(sIPAddress);

    if (!oIPAddress) {
        oIPAddress = new IPAddress(sIPAddress, 1, null, request.getHttpURL() + '|' + new Date().getTime());
    } else {
        oIPAddress = new IPAddress(sIPAddress, oIPAddress.count + 1, oIPAddress.age, request.getHttpURL() + '|' + new Date().getTime());
    }

    ipRequestCache.put(sIPAddress, oIPAddress);

    registerThresholds(oIPAddress, sIPAddress, oUserAgent);

    return oIPAddress;
}

/**
 * Determines wether or not the IP address has been blacklisted.
 * @param {Object} oIPAddress - The IP address object
 *
 * @returns {boolean} - Wether or not the IP is blacklisted
 */
function determineIfIPBlacklisted(oIPAddress) {
    var bbLogger = require('./util/BBLogger');
    var cachedBlackListStatus = cBlackListCache.get(oIPAddress.ip);

    if (cachedBlackListStatus === true) {
        bbLogger.log('Blacklisted ' + oIPAddress.ip + ' redirected.', 'debug', 'Blocker~validate');
        oIPAddress.blacklist();
        return true;
    } if (cachedBlackListStatus === false) {
        return false;
    }

    var IPBlackListMgr = require('./managers/IPBlacklistMgr');
    var oBlackListedIP = IPBlackListMgr.getIPAddress(oIPAddress.ip);

    if (oBlackListedIP) {
        if (oBlackListedIP.custom.status.value > 0) {
            cBlackListCache.put(oIPAddress.ip, true);
            oIPAddress.blacklist();
            return true;
        }
    }

    cBlackListCache.put(oIPAddress.ip, false);

    return false;
}

/**
 * Check wether the current request URL is filtered, and should not be taken into account by the
 * Bot Blocker plugin.
 *
 * @param {Object} request - The Salesforce Commerce Cloud request
 * @param {Object} oBBRequest - The Bot Blocker request object
 *
 * @returns {boolean} - Wether or not the request is filtered
 */
function ignoreRequestURL(request, oBBRequest) {
    var Logger = require('./util/BBLogger');
    var BBConfig = require('../models/system/config');

    var isFiltered = BBConfig.filteredUrls.some(function (sFilteredURL) {
        return request.getHttpPath().search(sFilteredURL) >= 0;
    });

    if (isFiltered) {
        var errorResponsePipelineMatches = request.getHttpPath().search('Blocker-Challenge');

        if (errorResponsePipelineMatches >= 0) {
            Logger.log('IP ' + JSON.stringify(oBBRequest) + ' loaded blacklist page.', 'error', 'BotBlockerRequestFilter~validate');
        }

        return true;
    }

    return false;
}

/**
 * This method will act as an entry point for any request which needs to be validated.
 *
 * @returns {boolean} If the request is OK
 */
function validate() {
    var BBRequest = require('../models/request');
    var UserAgent = require('../models/session/useragent');
    var Logger = require('./util/BBLogger');
    var oBBRequest = new BBRequest(request);

    if (ignoreRequestURL(request, oBBRequest)) {
        return true;
    }

    if (empty(oBBRequest.UserAgent)) {
        Logger.log('Blocked IP without useragent:' + oBBRequest.IP, 'error', 'Blocker~validate');

        return false;
    }

    if (oBBRequest.IP) {
        var oUserAgent = new UserAgent(oBBRequest.UserAgent);
        var oIPAddress = constructIPAddress(oBBRequest.IP, oUserAgent);

        if (determineIfIPBlacklisted(oIPAddress)) {
            Logger.log('Blocked blacklisted IP:' + oBBRequest.IP, 'error', 'Blocker~validate');

            return false;
        }

        var reachedTreshold = oIPAddress.checkThresholds();

        oIPAddress.save(oUserAgent);

        return !reachedTreshold;
    }

    return false;
}

module.exports = {
    validate: validate
};
