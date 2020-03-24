'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cPreferenceCache = CacheMgr.getCache('bbPreferences');
var preferenceMemoryCache = {};

module.exports = function (sKey) {
    if (preferenceMemoryCache[sKey]) return preferenceMemoryCache[sKey];

    var value = cPreferenceCache.get(sKey, function () {
        var System = require('dw/system/System');
        var oOrganizationPrefs = System.getPreferences();
        var result = oOrganizationPrefs.getCustom()[sKey];

        return result;
    });

    preferenceMemoryCache[sKey] = value;

    return value;
};
