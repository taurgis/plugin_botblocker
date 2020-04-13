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
    var oBotBlockerIP = CustomObjectMgr.getCustomObject('BotBlocker_Blacklisted', sIPAddress);

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
        var oBlackListedIP = getIPAddress(oIPAddress.ip);

        Transaction.wrap(function () {
            if (!oBlackListedIP) {
                oBlackListedIP = CustomObjectMgr.createCustomObject('BotBlocker_Blacklisted', oIPAddress.ip);
            }

            oBlackListedIP.custom.userAgent = JSON.stringify(oUserAgent || {}, null, 4);
            oBlackListedIP.custom.count = oIPAddress.count;
            oBlackListedIP.custom.age = (new Date().getTime() - oIPAddress.age) / 1000;
            oBlackListedIP.custom.status = 1;
        });
    } catch (e) {
        var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
        bbLogger.log('Exception blacklisting IP ' + oIPAddress.ip + '. Exception: ' + e, 'error', 'IPBlacklistMgr~saveIPAddress');

        return false;
    }

    return true;
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
function whitelist(oIPAddress, oUserAgent) {
    try {
        var oBlackListedIP = getIPAddress(oIPAddress.ip);

        Transaction.wrap(function () {
            if (!oBlackListedIP) {
                oBlackListedIP = CustomObjectMgr.createCustomObject('BotBlocker_Blacklisted', oIPAddress.ip);

                oBlackListedIP.custom.userAgent = JSON.stringify(oUserAgent || {}, null, 4);
                oBlackListedIP.custom.count = oIPAddress.count;
                oBlackListedIP.custom.age = (new Date().getTime() - oIPAddress.age) / 1000;
            }

            oBlackListedIP.custom.status = 0;
        });
    } catch (e) {
        var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
        bbLogger.log('Exception blacklisting IP ' + oIPAddress.ip + '. Exception: ' + e, 'error', 'IPBlacklistMgr~saveIPAddress');

        return false;
    }

    return true;
}

/**
 * Gets all blacklist items for the given status.
 *
 * @param {Integer} iStatus - The status (0 = whitelisted, 1 = blacklisted)
 *
 * @returns {Iterable<Object>} - The items with the status
 */
function getAll(iStatus) {
    var result = CustomObjectMgr.queryCustomObjects('BotBlocker_Blacklisted', 'custom.status = {0}', 'lastModified desc', iStatus);


    if (result && result.count > 0) {
        return result;
    }

    return null;
}

/**
 * Adds 1 to the amount of times an IP address has been blocked.
 *
 * @param {string} sIPAddress - The IP address
 */
function countBlocked(sIPAddress) {
    var oBlacklistedIP = getIPAddress(sIPAddress);

    if (oBlacklistedIP) {
        try {
            Transaction.wrap(function () {
                if (oBlacklistedIP.custom.blockedCount) {
                    oBlacklistedIP.custom.blockedCount += 1;
                } else {
                    oBlacklistedIP.custom.blockedCount = 1;
                }
            });
        } catch (e) {
            var bbLogger = require('~/cartridge/scripts/util/BBLogger.js');
            bbLogger.log('Exception trying to add 1 to the blocked found for ' + sIPAddress + '. Exception: ' + e, 'error', 'IPBlacklistMgr~countBlocked');
        }
    }
}

module.exports = {
    getIPAddress: getIPAddress,
    saveIPAddress: saveIPAddress,
    whitelist: whitelist,
    getAll: getAll,
    countBlocked: countBlocked
};
