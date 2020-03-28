'use strict';

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

/**
 * Renders the general TFD page.
 */
function start() {
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
    var Calendar = require('dw/util/Calendar');
    var now = new Calendar();
    var lastWeek = new Calendar();
    lastWeek.add(Calendar.DAY_OF_YEAR, -7);


    app.getView({
    	mainmenuname: request.httpParameterMap.mainmenuname.value,
        CurrentMenuItemId: request.httpParameterMap.CurrentMenuItemId.value,
        IPItems: IPMgr.getAllBetweenDates(lastWeek.getTime(), now.getTime())
    }).render('bb/start');
}


exports.Start = guard.ensure(['get', 'https'], start);
