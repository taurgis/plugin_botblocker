'use strict';

/**
 * The configuration object of Bot Blocker. All configureable elements in the Business Manager are
 * loaded here.
 */
function Config() {
    var getPreference = require('../../scripts/util/getPreference');
    var lCustomFilters = getPreference('BB_filtered_urls');

    this.firstBlockThreshold = getPreference('BB_first_threshold');
    this.secondBlockThreshold = getPreference('BB_second_threshold');
    this.disableBlacklisting = getPreference('BB_disable_blacklisting');
    this.thresholdTTL = getPreference('BB_threshold_lifetime');
    this.enableIPMonitoring = getPreference('BB_enable_ip_monitoring');
    this.enabled = getPreference('BB_Enabled');
    this.filteredUrls = [
        'Blocker-Challenge',
        '__Analytics-Start',
        '/demandware.store/Sites-Site/'
    ];

    if (lCustomFilters) {
        this.filteredUrls = this.filteredUrls.concat(lCustomFilters.slice(0));
    }
}


module.exports = new Config()
;
