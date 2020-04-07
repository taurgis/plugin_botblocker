'use strict';

/* Script Modules */
var guard = require('~/cartridge/scripts/guard');

/**
 * Renders the general BB page.
 */
function start() {
    var app = require('~/cartridge/scripts/app');
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
    var Calendar = require('dw/util/Calendar');
    var now = new Calendar();
    var lastWeek = new Calendar();
    lastWeek.add(Calendar.DAY_OF_YEAR, -7);

    app.getView({
        IPItems: IPMgr.getAllBetweenDates(lastWeek.getTime(), now.getTime())
    }).render('botblocker/start');
}

/**
 * Renders the detail page of an IP
 */
function detail() {
    var app = require('~/cartridge/scripts/app');
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
    var IPBlackListMgr = require('*/cartridge/scripts/managers/IPBlacklistMgr');
    var UserAgent = require('*/cartridge/models/session/useragent');
    var IPDetail = require('../scripts/model/IPDetail');

    var dIPAddress = IPMgr.getIPAddress(request.httpParameterMap.ip.stringValue);
    var dIPBlacklist = IPBlackListMgr.getIPAddress(request.httpParameterMap.ip.stringValue);
    var sUserAgent = JSON.parse(dIPAddress.custom.userAgent).source;

    var ipAddressUserAgent = new UserAgent(sUserAgent);
    ipAddressUserAgent.parse();

    app.getView({
        oIPDetail: new IPDetail(dIPAddress, dIPBlacklist, ipAddressUserAgent)
    }).render('botblocker/iplogging/ipdetail');
}

exports.Start = guard.ensure(['get', 'https'], start);
exports.Detail = guard.ensure(['get', 'https'], detail);
