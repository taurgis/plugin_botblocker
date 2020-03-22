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

IpAddress.prototype.registerThreshold = function (amount, fCallbackFunction) {
    if (!this.thresholds) {
        this.thresholds = {};
    }

    this.thresholds[amount] = fCallbackFunction;
};

IpAddress.prototype.checkThresholds = function () {
    var currentCount = this.count;
    var oThresholds = this.thresholds;
    var bThresholdReached = false;
    if (this.thresholds) {
        Object.keys(this.thresholds).sort().some(function (threshold) {
            if (currentCount > threshold) {
                bThresholdReached = oThresholds[threshold]();

                return true;
            }

            return false;
        });
    }

    return bThresholdReached;
};

/**
 * Checks wether or not the IP count can be reset.
 *
 * @returns {boolean} - Wether or not the IP address has expired
 */
IpAddress.prototype.isExpired = function () {
    var curTime = new Date().getTime();
    var secondsSinceFirstRequest = (curTime - this.age) / 1000;

    return secondsSinceFirstRequest > 120;
};

module.exports = IpAddress;
