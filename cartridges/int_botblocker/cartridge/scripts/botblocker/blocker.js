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
    var IPAddress = require('../model/ipAddress');
    var errorResponsePipelineMatches = request.getHttpPath().search('Blocker-Challenge');

    if (errorResponsePipelineMatches >= 0) {
        return true;
    }

    try {
        var requestParamsMap = bbRequest.getRequestParameters(request);
        var sIPAddress = determineIP(requestParamsMap);
        var sUserAgent = requestParamsMap.get('UserAgent');
        var uUserAgent = new UserAgent(sUserAgent);
        uUserAgent.parse();

        if (sIPAddress != null) {
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
                return false;
            }

            if (!oIPAddress.isBelowSecondThreshold()) {
                bbLogger.log(sIPAddress + ' reached second threshold.', 'error', 'Blocker~validate');
                return false;
            }

            if (!oIPAddress.isBelowFirstThreshold()) {
                bbLogger.log(sIPAddress + ' reached first threshold.', 'error', 'Blocker~validate');


                var result = true;

                return result.isBot;
            }
        } else {
            return false;
        }
    } catch (e) {
        bbLogger.log('An error occured while trying to validate request with the Bot Blocker plugin ' + e, 'error', 'Blocker~validate');
    }


    return true;
}

module.exports = {
    validate: validate
};
