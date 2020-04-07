'use strict';

/**
 * Determines the users IP address based on the request. This can be different on every environment because
 * of Cloudflare and other middleware.
 *
 * @param {Request} request - current request object
 *
 * @returns {string} - The IP address
 */
function determineIPAddress(request) {
    var requestHeaders = request.getHttpHeaders();
    var sIPAddress = request.getHttpRemoteAddress();

    if (requestHeaders.get('X-Forwarded-For')) {
        sIPAddress = requestHeaders.get('X-Forwarded-For');
    } else if (requestHeaders.get('x-forwarded-for')) {
        sIPAddress = requestHeaders.get('x-forwarded-for');
    }

    if (requestHeaders.get('X-Real-IP')) {
        sIPAddress = requestHeaders.get('X-Real-IP');
    } else if (requestHeaders.get('x-real-ip')) {
        sIPAddress = requestHeaders.get('x-real-ip');
    }

    if (requestHeaders.get('True-Client-IP')) {
        sIPAddress = requestHeaders.get('True-Client-IP');
    } else if (requestHeaders.get('true-client-ip')) {
        sIPAddress = requestHeaders.get('true-client-ip');
    }

    return sIPAddress;
}

/**
 * This method is used to build request params.
 *
 * @param {Request} request - current request object
 */
function Request(request) {
    this.IP = determineIPAddress(request);
    this.UserAgent = request.getHttpUserAgent();
}

/* Module Exports */
module.exports = Request;
