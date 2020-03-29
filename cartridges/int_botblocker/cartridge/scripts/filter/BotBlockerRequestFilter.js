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
    if (!request.includeRequest && request.httpRequest) {
        var startTime = new Date().getTime();
        var bbLogger = require('../util/BBLogger');
        var botBlocker = require('../botblocker/blocker');

        var isValid = botBlocker.validate();

        if (!isValid) {
            var getPreference = require('../util/getPreference');

            if (!getPreference('disableBlacklisting')) {
                var redirectUrl = URLUtils.https('Blocker-Challenge').toString();
                response.redirect(redirectUrl);
            }
        }


        bbLogger.log('Time to process request in MS: ' + (new Date().getTime() - startTime), 'debug', 'BotBlockerRequestFilter~validate');
    }

    return new Status(Status.OK);
}

module.exports = {
    onRequest: validate
};
