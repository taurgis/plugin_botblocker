'use strict';

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

/**
 * Renders the general BB page.
 */
function start() {
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
    var Calendar = require('dw/util/Calendar');
    var now = new Calendar();
    var lastWeek = new Calendar();
    lastWeek.add(Calendar.DAY_OF_YEAR, -7);

    app.getView({
        IPItems: IPMgr.getAllBetweenDates(lastWeek.getTime(), now.getTime())
    }).render('bb/start');
}

/**
 * Renders the detail page of an IP
 */
function detail() {
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');


    app.getView({
        IPAddress: IPMgr.getIPAddress(request.httpParameterMap.ip.stringValue)
    }).render('bb/ipdetail');
}


exports.Start = guard.ensure(['get', 'https'], start);
exports.Detail = guard.ensure(['get', 'https'], detail);
