'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cPreferenceCache = CacheMgr.getCache('bbPreferences');

module.exports = function (sKey) {
    return cPreferenceCache.get(sKey, function () {
        var System = require('dw/system/System');
        var oOrganizationPrefs = System.getPreferences();
        var result = oOrganizationPrefs.getCustom()[sKey];

        return result;
    });
};
