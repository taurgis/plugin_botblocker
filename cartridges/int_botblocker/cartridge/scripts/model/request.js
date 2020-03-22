'use strict';

/* API Includes */
var StringUtils = require('dw/util/StringUtils');

/**
 * This method is used to check the size of provided request parameter, if it's below or equal to limit then
 * It returns the original value but if it's more than limit then it will truncate the value and return that
 * truncated value.
 *
 * @param {string} requestParam - request parameter
 * @Param {number} limit - request param size
 * @returns {string} requestParameter - truncated request parameter
 */
function truncateRequestParam(requestParam, limit) {
    var requestParameter = (requestParam && requestParam.length > limit)
        ? StringUtils.truncate(requestParam, limit, null, null)
        : requestParam;

    return requestParameter;
}

/**
 * This method is used to build request params by providing their limit in bytes, using RequestHandler method to truncate
 * params value if they exceed the provided limit. These limits are encouraged by Data Dome API.
 *
 * @param {Request} request - current request object
 */
function Request(request) {
    var requestHeaders = request.getHttpHeaders();

    this.IP = request.getHttpRemoteAddress();
    this.UserAgent = truncateRequestParam(request.getHttpUserAgent(), 768);

    if (requestHeaders.get('X-Forwarded-For')) {
        this.XForwaredForIP = truncateRequestParam(requestHeaders.get('X-Forwarded-For'), 512);
    } else if (requestHeaders.get('x-forwarded-for')) {
        this.XForwaredForIP = truncateRequestParam(requestHeaders.get('x-forwarded-for'), 512);
    }

    if (requestHeaders.get('X-Real-IP')) {
        this['X-Real-IP'] = requestHeaders.get('X-Real-IP');
    } else if (requestHeaders.get('x-real-ip')) {
        this['X-Real-IP'] = requestHeaders.get('x-real-ip');
    }

    if (requestHeaders.get('True-Client-IP')) {
        this.TrueClientIP = requestHeaders.get('True-Client-IP');
    } else if (requestHeaders.get('true-client-ip')) {
        this.TrueClientIP = requestHeaders.get('true-client-ip');
    }
}

/* Module Exports */
module.exports = Request;
