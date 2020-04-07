'use strict';

/**
 * The configuration object of Bot Blocker. All configureable elements in the Business Manager are
 * loaded here.
 */
function Config() {
    var getPreference = require('../../scripts/util/getPreference');

    this.firstBlockThreshold = getPreference('firstBlockThreshold');
    this.secondBlockThreshold = getPreference('secondBlockThreshold');
    this.disableBlacklisting = getPreference('disableBlacklisting');
    this.ipTTL = getPreference('ipTTL');
    this.enableIPCustomObject = getPreference('enableIPCustomObject');
}


module.exports = new Config()
;
