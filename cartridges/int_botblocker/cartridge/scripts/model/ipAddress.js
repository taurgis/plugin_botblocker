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

IpAddress.prototype.isBelowThreshold = function () {
    return this.count < 1000;
};


module.exports = IpAddress;
