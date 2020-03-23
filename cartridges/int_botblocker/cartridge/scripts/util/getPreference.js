'use strict';

module.exports = function (sKey) {
    var System = require('dw/system/System');
    var oOrganizationPrefs = System.getPreferences();

    return oOrganizationPrefs.getCustom()[sKey];
};
