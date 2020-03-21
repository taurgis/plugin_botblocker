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

IpAddress.prototype.isBelowFirstThreshold = function () {
    return this.count < 1200;
};

IpAddress.prototype.isBelowSecondThreshold = function () {
    return this.count < 2400;
};

IpAddress.prototype.isBelowThirdThreshold = function () {
    return this.count < 4600;
};


module.exports = IpAddress;
