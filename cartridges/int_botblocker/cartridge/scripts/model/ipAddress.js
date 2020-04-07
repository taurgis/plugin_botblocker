'use strict';

/**
 * The IpAddress object to manage information related to the IP.
 * @constructor
 * @param {string} ip - The IP Address
 * @param {integer} count - The number of requests made
 * @param {long} age - The date of the first recorded request
 * @param {string} page - The page visited
 */
function IpAddress(ip, count, age, page) {
    this.ip = ip;
    this.age = age || new Date().getTime();
    this.count = count;
    this.page = page;

    if ((age !== null) && this.isExpired()) {
        var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');

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
    if (!this.thresholds) return false;

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
    var BBConfig = require('../../models/system/config');

    var curTime = new Date().getTime();
    var secondsSinceFirstRequest = (curTime - this.age) / 1000;

    return secondsSinceFirstRequest > BBConfig.ipTTL;
};

IpAddress.prototype.blacklist = function (oUserAgent) {
    var IPBlacklistMgr = require('../managers/IPBlacklistMgr');
    IPBlacklistMgr.saveIPAddress(this, oUserAgent);
};

IpAddress.prototype.save = function (oUserAgent) {
    var BBConfig = require('../../models/system/config');

    if (BBConfig.enableIPCustomObject) {
        var IPMgr = require('../managers/IPMgr');
        IPMgr.saveIPAddress(this, oUserAgent);
    }
};

module.exports = IpAddress;
