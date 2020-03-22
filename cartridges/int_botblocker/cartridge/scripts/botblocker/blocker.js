'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var bbRequest = require('~/cartridge/scripts/model/request');
var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
var UserAgent = require('./useragent');

/**
 * Fetches the IP from the current request.
 * @param {dw.util.HashMap} requestMap - The request map containing all values from the request
 *
 * @returns {string} - The IP address of the client making the request
 */
function determineIP(requestMap) {
    if (requestMap.containsKey('TrueClientIP')) {
        return requestMap.get('TrueClientIP');
    }

    if (requestMap.containsKey('X-Real-IP')) {
        return requestMap.get('X-Real-IP');
    }
    if (requestMap.containsKey('IP')) {
        return requestMap.get('IP');
    }

    return null;
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

    var requestParamsMap = bbRequest.getRequestParameters(request);
    var sIPAddress = determineIP(requestParamsMap);
    var uUserAgent = new UserAgent(requestParamsMap.get('UserAgent'));

    if (empty(uUserAgent.source)) {
        return false;
    }

    if (sIPAddress != null) {
        if (cBlackListCache.get(sIPAddress)) {
            return false;
        }

        var ipRequestCache = CacheMgr.getCache('bbIPRequest');
        var oIPAddress = ipRequestCache.get(sIPAddress);

        if (!oIPAddress) {
            oIPAddress = new IPAddress(sIPAddress, 1);
        } else {
            oIPAddress = new IPAddress(sIPAddress, oIPAddress.count + 1);
        }

        ipRequestCache.put(sIPAddress, oIPAddress);

        bbLogger.log('Got IP ' + sIPAddress + ' with request count ' + oIPAddress.count + ' and user agent ' + JSON.stringify(uUserAgent, null, 4), 'debug', 'Blocker~validate');

        if (!oIPAddress.isBelowThirdThreshold()) {
            bbLogger.log(sIPAddress + ' reached third threshold.', 'error', 'Blocker~validate');
            cBlackListCache.put(sIPAddress, true);

            return false;
        }

        if (!oIPAddress.isBelowSecondThreshold()) {
            bbLogger.log(sIPAddress + ' reached second threshold.', 'error', 'Blocker~validate');

            if (!uUserAgent.isSafe()) {
                cBlackListCache.put(sIPAddress, true);
                return false;
            }
        }

        if (!oIPAddress.isBelowFirstThreshold()) {
            bbLogger.log(sIPAddress + ' reached first threshold.', 'error', 'Blocker~validate');
            uUserAgent.parse();
            if (!uUserAgent.isSafe()) {
                cBlackListCache.put(sIPAddress, true);

                return false;
            }
        }
    } else {
        return false;
    }


    return true;
}

module.exports = {
    validate: validate
};
