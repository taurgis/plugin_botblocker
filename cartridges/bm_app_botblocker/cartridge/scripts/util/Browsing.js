'use strict';

/**
 * @module util/Browsing
 */

/**
 * Recovers the last url from the click stream
 * @return {dw.web.URL} the last called URL
 */
exports.lastUrl = function lastUrl() {
    var URLUtils = require('dw/web/URLUtils');
    var location = URLUtils.url('Home-Show');
    var click = session.clickStream.last;
    if (click) {
        location = URLUtils.url(click.pipelineName);
        if (!empty(click.queryString) && click.queryString.indexOf('=') !== -1) {
            var params = click.queryString.split('&');
            params.forEach(function (param) {
                location.append.apply(location, param.split('='));
            });
        }
    }
    return location;
};
