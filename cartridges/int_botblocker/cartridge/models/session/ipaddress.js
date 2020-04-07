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
        var Logger = require('../../scripts/util/BBLogger');

        Logger.log('IP ' + this.ip + ' expired.', 'debug', 'IPAddress~expireIfNecessary');
        this.count = 1;
        this.age = new Date().getTime();
    }
}

IpAddress.prototype.registerThreshold = function (iAmount, fCallbackFunction) {
    if (!this.thresholds) {
        this.thresholds = {};
    }

    this.thresholds[iAmount] = fCallbackFunction;
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
    var BBConfig = require('../system/config');

    var curTime = new Date().getTime();
    var iSecondsPassed = (curTime - this.age) / 1000;

    return iSecondsPassed > BBConfig.thresholdTTL;
};

IpAddress.prototype.blacklist = function (oUserAgent) {
    var IPBlacklistMgr = require('../../scripts/managers/IPBlacklistMgr');
    IPBlacklistMgr.saveIPAddress(this, oUserAgent);
};

IpAddress.prototype.save = function (oUserAgent) {
    var BBConfig = require('../system/config');

    if (BBConfig.enableIPMonitoring) {
        var IPMgr = require('../../scripts/managers/IPMgr');
        IPMgr.saveIPAddress(this, oUserAgent);
    }
};

module.exports = IpAddress;
