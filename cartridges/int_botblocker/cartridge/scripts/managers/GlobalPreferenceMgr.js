'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cPreferenceCache = CacheMgr.getCache('bbPreferences');
var preferenceMemoryCache = {};

/**
 * Fetches a preference from the Global Preferences configured in Commerce Cloud
 * @param {string} sKey - The preference ID
 *
 * @returns {Object} - The preference value
 */
function getPreference(sKey) {
    if (preferenceMemoryCache[sKey]) return preferenceMemoryCache[sKey];

    var value = cPreferenceCache.get(sKey, function () {
        var System = require('dw/system/System');
        var oOrganizationPrefs = System.getPreferences();
        var result = oOrganizationPrefs.getCustom()[sKey];

        return result;
    });

    preferenceMemoryCache[sKey] = value;

    return value;
}

module.exports = {
    getPreference: getPreference
};
