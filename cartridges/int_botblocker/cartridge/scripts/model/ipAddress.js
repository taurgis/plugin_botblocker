'use strict';

/**
 * The IpAddress object to manage information related to the IP.
 * @constructor
 * @param {string} ip - The IP Address
 * @param {integer} count - The number of requests made
 */
function IpAddress(ip, count) {
    this.ip = ip;
    this.count = count;
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


module.exports = IpAddress;
