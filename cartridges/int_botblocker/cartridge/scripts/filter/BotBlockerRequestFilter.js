'use strict';

var Status = require('dw/system/Status');
var URLUtils = require('dw/web/URLUtils');

/**
 * This method will intercept all incoming requests in the storefront and will only validate requests
 * that meets certain criteria. The method will skip remote includes and non HTTP requests.
 * If the request has to be validated then will invoke the blocker logic to perform validation. It will redirect
 * incoming requests if the blocker decides to block invalid requests.
 *
 * @returns {Object} ddResponse
 */
function validate() {
    var BBConfig = require('../../models/system/config');

    if (BBConfig.enabled) {
        if (!request.includeRequest && request.httpRequest) {
            var startTime = new Date().getTime();
            var Logger = require('../util/BBLogger');
            var blocker = require('../botblocker');

            var isValid = blocker.validate();

            if (!isValid) {
                if (!BBConfig.disableBlacklisting) {
                    var IPBlacklistMgr = require('../managers/IPBlacklistMgr');
                    var BBRequest = require('../../models/request');
                    var redirectUrl = URLUtils.https('Blocker-Challenge').toString();
                    var oBBRequest = new BBRequest(request);
                    var oBlacklistedIP = IPBlacklistMgr.getIPAddress(oBBRequest.IP);

                    if (oBlacklistedIP) {
                        var Transaction = require('dw/system/Transaction');

                        Transaction.wrap(function () {
                            if (oBlacklistedIP.custom.blockedCount) {
                                oBlacklistedIP.custom.blockedCount += 1;
                            } else {
                                oBlacklistedIP.custom.blockedCount = 1;
                            }
                        });
                    }


                    Logger.log('Redirected IP ' + JSON.stringify(oBBRequest) + ' to blacklist page.', 'error', 'BotBlockerRequestFilter~validate');

                    response.redirect(redirectUrl);
                }
            }

            Logger.log('Time to process request in MS: ' + (new Date().getTime() - startTime), 'debug', 'BotBlockerRequestFilter~validate');
        }
    }

    return new Status(Status.OK);
}

module.exports = {
    onRequest: validate
};
