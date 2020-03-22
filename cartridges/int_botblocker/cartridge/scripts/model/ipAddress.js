'use strict';

var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');

/**
 * The IpAddress object to manage information related to the IP.
 * @constructor
 * @param {string} ip - The IP Address
 * @param {integer} count - The number of requests made
 * @param {long} age - The date of the first recorded request
 */
function IpAddress(ip, count, age) {
    this.ip = ip;
    this.age = age || new Date().getTime();
    this.count = count;

    if ((age !== null) && this.isExpired()) {
        bbLogger.log('IP ' + this.ip + ' expired.', 'debug', 'IPAddress~expireIfNecessary');
        this.count = 1;
        this.age = new Date().getTime();
    }
}

/**
 * The first threshold of requests an IP has made within the cache time period.
 *
 * Note: When this threshold is reached, we check if the user agent is valid or not.
 *
 * @returns {integer} - Wether or not the IP is below the threshold.
 */
IpAddress.prototype.isBelowFirstThreshold = function () {
    return this.count < 1200;
};

/**
 * The second threshold of requests an IP has made within the cache time period.
 *
 * Note: The request is automatically blocked and redirected.
 *
 * @returns {integer} - Wether or not the IP is below the threshold.
 */
IpAddress.prototype.isBelowSecondThreshold = function () {
    return this.count < 2400;
};

/**
 * The third threshold of requests an IP has made within the cache time period.
 *
 * Note: The request is automatically blocked and redirected.
 *
 * @returns {integer} - Wether or not the IP is below the threshold.
 */
IpAddress.prototype.isBelowThirdThreshold = function () {
    return this.count < 4600;
};

/**
 * Checks wether or not the IP count can be reset.
 *
 * @returns {boolean} - Wether or not the IP address has expired
 */
IpAddress.prototype.isExpired = function () {
    var curTime = new Date().getTime();
    var secondsSinceFirstRequest = (curTime - this.age) / 1000;

    return this.isBelowSecondThreshold() && (secondsSinceFirstRequest > 120);
};

module.exports = IpAddress;
