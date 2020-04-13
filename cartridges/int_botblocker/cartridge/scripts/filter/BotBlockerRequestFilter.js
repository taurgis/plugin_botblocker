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
                    var oBBRequest = new BBRequest(request);

                    IPBlacklistMgr.countBlocked(oBBRequest.IP);
                    Logger.log('Redirected IP ' + JSON.stringify(oBBRequest) + ' to blacklist page.', 'error', 'BotBlockerRequestFilter~validate');

                    response.redirect(URLUtils.https('Blocker-Challenge').toString());
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
