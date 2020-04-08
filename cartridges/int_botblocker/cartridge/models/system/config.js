'use strict';

/**
 * The configuration object of Bot Blocker. All configureable elements in the Business Manager are
 * loaded here.
 */
function Config() {
    var GlobalPreferenceMgr = require('../../scripts/managers/GlobalPreferenceMgr');
    var lCustomFilters = GlobalPreferenceMgr.getPreference('BB_filtered_urls');

    this.firstBlockThreshold = GlobalPreferenceMgr.getPreference('BB_first_threshold');
    this.secondBlockThreshold = GlobalPreferenceMgr.getPreference('BB_second_threshold');
    this.disableBlacklisting = GlobalPreferenceMgr.getPreference('BB_disable_blacklisting');
    this.thresholdTTL = GlobalPreferenceMgr.getPreference('BB_threshold_lifetime');
    this.enableIPMonitoring = GlobalPreferenceMgr.getPreference('BB_enable_ip_monitoring');
    this.enabled = GlobalPreferenceMgr.getPreference('BB_Enabled');
    this.filteredUrls = [
        'Blocker-Challenge',
        '/challenge',
        '/__',
        '/demandware.store/Sites-Site/'
    ];

    if (lCustomFilters) {
        this.filteredUrls = this.filteredUrls.concat(lCustomFilters.slice(0));
    }
}


module.exports = new Config()
;
