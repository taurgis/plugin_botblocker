'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

/**
 * Fetches an IP address custom object based on the IP address string.
 * @param {string} sIPAddress - The IP address as a string
 *
 * @returns {Object|null} - The IP address object
 */
function getIPAddress(sIPAddress) {
    var oBotBlockerIP = CustomObjectMgr.getCustomObject('BotBlocker_IP', sIPAddress);

    if (oBotBlockerIP) {
        return oBotBlockerIP;
    }

    return null;
}

/**
 * Saves an IP address custom object based on the IP address, or updates it when
 * it already exists.
 *
 * @param {Object} oIPAddress - The IP address object
 * @param {Object} oUserAgent - The User Agent object (Optional)
 *
 * @returns {boolean} - Wether or not the update was successfull
 */
function saveIPAddress(oIPAddress, oUserAgent) {
    try {
        var oBotBlockerIP = getIPAddress(oIPAddress.ip);

        Transaction.wrap(function () {
            if (!oBotBlockerIP) {
                oBotBlockerIP = CustomObjectMgr.createCustomObject('BotBlocker_IP', oIPAddress.ip);
            }

            oBotBlockerIP.custom.userAgent = JSON.stringify(oUserAgent || {}, null, 4);
            oBotBlockerIP.custom.count = oIPAddress.count;
            oBotBlockerIP.custom.age = (new Date().getTime() - oIPAddress.age) / 1000;

            var pageHistory = oBotBlockerIP.custom.pageHistory.slice(0);

            if (pageHistory.length >= 25) {
                pageHistory.shift();
            }

            if (pageHistory.length > 100) {
                pageHistory = [];
            }

            pageHistory.push(oIPAddress.page);

            oBotBlockerIP.custom.pageHistory = pageHistory;
        });
    } catch (e) {
        var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
        bbLogger.log('Exception saving Bot Blocker IP custom object for IP ' + oIPAddress.ip + '. Exception: ' + e, 'error', 'IPMgr~saveIPAddress');

        return false;
    }

    return true;
}

/**
 * Gets
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 *
 * @returns {Iterable<Object>} - The items between the start and end date
 */
function getAllBetweenDates(startDate, endDate) {
    var result = CustomObjectMgr.queryCustomObjects('BotBlocker_IP', 'lastModified  >= {0} AND lastModified  <= {1}', 'lastModified desc', startDate, endDate);

    if (result && result.count > 0) {
        return result;
    }

    return null;
}

module.exports = {
    getIPAddress: getIPAddress,
    saveIPAddress: saveIPAddress,
    getAllBetweenDates: getAllBetweenDates
};
