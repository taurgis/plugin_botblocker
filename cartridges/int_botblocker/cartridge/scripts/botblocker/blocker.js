'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cBlackListCache = CacheMgr.getCache('bbBlacklisted');
var BBRequest = require('~/cartridge/scripts/model/request');
var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
var UserAgent = require('./useragent');

/**
 * Registers the threshold functions for handeling requests.
 *
 * @param {Object} oIPAddress - The IP address object to register the functions to
 * @param {string} sIPAddress  - The current request IP address
 * @param {Object} oUserAgent - The user agent object for the current request
 */
function registerThresholds(oIPAddress, sIPAddress, oUserAgent) {
    oIPAddress.registerThreshold(2400, function () {
        bbLogger.log(sIPAddress + ' reached second threshold.', 'error', 'Blocker~validate');

        cBlackListCache.put(sIPAddress, true);

        oUserAgent.parse();
        oIPAddress.blacklist(oUserAgent);

        return true;
    });

    oIPAddress.registerThreshold(1200, function () {
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

/**
 * Constructs the IP Address object based on the request IP.
 * @param {string} sIPAddress - The IP address of the request
 * @param {Object} oUserAgent - The User Agent object
 * @returns {Object} - The IP address object
 */
function constructIPAddress(sIPAddress, oUserAgent) {
    var IPAddress = require('../model/ipAddress');
    var ipRequestCache = CacheMgr.getCache('bbIPRequest');
    var oIPAddress = ipRequestCache.get(sIPAddress);

    if (!oIPAddress) {
        oIPAddress = new IPAddress(sIPAddress, 1);
    } else {
        oIPAddress = new IPAddress(sIPAddress, oIPAddress.count + 1, oIPAddress.age);
    }

    ipRequestCache.put(sIPAddress, oIPAddress);

    registerThresholds(oIPAddress, sIPAddress, oUserAgent);

    return oIPAddress;
}

/**
 * This method will act as an entry point for any request which needs to be validated.
 *
 * @returns {boolean} If the request is OK
 */
function validate() {
    var errorResponsePipelineMatches = request.getHttpPath().search('Blocker-Challenge');

    if (errorResponsePipelineMatches >= 0) {
        return true;
    }

    var oBBRequest = new BBRequest(request);
    var sIPAddress = oBBRequest.TrueClientIP || oBBRequest['X-Real-IP'] || oBBRequest.IP;
    var oUserAgent = new UserAgent(oBBRequest.UserAgent);

    if (empty(oUserAgent.source)) {
        return false;
    }

    if (sIPAddress != null) {
        if (cBlackListCache.get(sIPAddress)) {
            bbLogger.log('Blacklisted ' + sIPAddress + ' redirected.', 'debug', 'Blocker~validate');

            return false;
        }

        var oIPAddress = constructIPAddress(sIPAddress, oUserAgent);

        bbLogger.log('Got IP ' + sIPAddress + ' with request count ' + oIPAddress.count, 'debug', 'Blocker~validate');

        var reachedTreshold = oIPAddress.checkThresholds();

        oIPAddress.save(oUserAgent);

        return !reachedTreshold;
    }

    return false;
}

module.exports = {
    validate: validate
};
