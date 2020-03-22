'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var BBRequest = require('~/cartridge/scripts/model/request');
var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
var UserAgent = require('./useragent');

/**
 * Registers the threshold functions for handeling requests.
 *
 * @param {Object} oIPAddress - The IP address object to register the functions to
 * @param {string} sIPAddress  - The current request IP address
 * @param {Object} cBlackListCache - The blacklist cache
 * @param {Object} uUserAgent - The user agent object for the current request
 */
function registerThresholds(oIPAddress, sIPAddress, cBlackListCache, uUserAgent) {
    oIPAddress.registerThreshold(2400, function () {
        bbLogger.log(sIPAddress + ' reached second threshold.', 'error', 'Blocker~validate');
        cBlackListCache.put(sIPAddress, true);
        return true;
    });
    oIPAddress.registerThreshold(1200, function () {
        bbLogger.log(sIPAddress + ' reached first threshold.', 'debug', 'Blocker~validate');
        uUserAgent.parse();
        if (!uUserAgent.isSafe()) {
            cBlackListCache.put(sIPAddress, true);
            return true;
        }
        return false;
    });
}

/**
 * This method will act as an entry point for any request which needs to be validated.
 *
 * @returns {boolean} If the request is OK
 */
function validate() {
    var cBlackListCache = CacheMgr.getCache('bbBlacklisted');
    var IPAddress = require('../model/ipAddress');
    var errorResponsePipelineMatches = request.getHttpPath().search('Blocker-Challenge');

    if (errorResponsePipelineMatches >= 0) {
        return true;
    }

    var oBBRequest = new BBRequest(request);
    var sIPAddress = oBBRequest.TrueClientIP || oBBRequest['X-Real-IP'] || oBBRequest.IP;
    var uUserAgent = new UserAgent(oBBRequest.UserAgent);

    if (empty(uUserAgent.source)) {
        return false;
    }

    if (sIPAddress != null) {
        if (cBlackListCache.get(sIPAddress)) {
            bbLogger.log('Blacklisted ' + sIPAddress + ' redirected.', 'debug', 'Blocker~validate');

            return false;
        }

        var ipRequestCache = CacheMgr.getCache('bbIPRequest');
        var oIPAddress = ipRequestCache.get(sIPAddress);

        if (!oIPAddress) {
            oIPAddress = new IPAddress(sIPAddress, 1);
        } else {
            oIPAddress = new IPAddress(sIPAddress, oIPAddress.count + 1, oIPAddress.age);
        }

        ipRequestCache.put(sIPAddress, oIPAddress);

        registerThresholds(oIPAddress, sIPAddress, cBlackListCache, uUserAgent);

        bbLogger.log('Got IP ' + sIPAddress + ' with request count ' + oIPAddress.count + ' and user agent ' + JSON.stringify(uUserAgent, null, 4), 'debug', 'Blocker~validate');

        return !oIPAddress.checkThresholds();
    }

    return false;
}

module.exports = {
    validate: validate
};
