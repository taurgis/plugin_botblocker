'use strict';

/**
 * The IP Details class for the business manager module.
 * @param {Object} dIPAddress - The IP address custom object
 * @param {Object} dBlackListIP - The Blacklist custom object
 * @param {Object} oUserAgent - The user agent
 */
function IPDetails(dIPAddress, dBlackListIP, oUserAgent) {
    this.ip = dIPAddress.custom.IP;
    this.count = dIPAddress.custom.count;
    this.age = dIPAddress.custom.age;
    this.pageHistory = dIPAddress.custom.pageHistory.slice(0);
    this.userAgent = oUserAgent;
    this.blacklistStatus = dBlackListIP ? dBlackListIP.custom.status.value : false;
}

module.exports = IPDetails;
