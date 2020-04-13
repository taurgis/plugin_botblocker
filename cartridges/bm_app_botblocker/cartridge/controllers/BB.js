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
    var URLUtils = require('dw/web/URLUtils');
    var now = new Calendar();
    var lastWeek = new Calendar();
    lastWeek.add(Calendar.DAY_OF_YEAR, -7);

    app.getView({
        IPItems: IPMgr.getAllBetweenDates(lastWeek.getTime(), now.getTime()),
        title: 'IP Monitor',
        home: URLUtils.url('BB-Start')
    }).render('botblocker/start');
}

/**
 * Renders the detail page of an IP
 */
function detail() {
    var URLUtils = require('dw/web/URLUtils');
    var app = require('~/cartridge/scripts/app');
    var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
    var IPBlackListMgr = require('*/cartridge/scripts/managers/IPBlacklistMgr');
    var UserAgent = require('*/cartridge/models/session/useragent');
    var IPDetail = require('../scripts/model/IPDetail');

    var dIPAddress = IPMgr.getIPAddress(request.httpParameterMap.ip.stringValue);
    var sSource = IPMgr.getIPAddress(request.httpParameterMap.source.stringValue);
    var dIPBlacklist = IPBlackListMgr.getIPAddress(request.httpParameterMap.ip.stringValue);
    var sUserAgent = JSON.parse(dIPAddress.custom.userAgent).source;

    var ipAddressUserAgent = new UserAgent(sUserAgent);
    ipAddressUserAgent.parse();

    app.getView({
        oIPDetail: new IPDetail(dIPAddress, dIPBlacklist, ipAddressUserAgent),
        home: sSource === 'ip' ? URLUtils.url('BB-Start') : URLUtils.url('BB-StartBlacklist')
    }).render('botblocker/iplogging/ipdetail');
}

/**
 * Renders the general BB page.
 */
function startBlacklist() {
    var URLUtils = require('dw/web/URLUtils');
    var app = require('~/cartridge/scripts/app');
    var IPBlacklistMgr = require('*/cartridge/scripts/managers/IPBlacklistMgr');

    app.getView({
        IPItems: IPBlacklistMgr.getAll(1),
        title: 'Blacklist',
        home: URLUtils.url('BB-StartBlacklist')
    }).render('botblocker/startblacklist');
}

exports.Start = guard.ensure(['get', 'https'], start);
exports.Detail = guard.ensure(['get', 'https'], detail);
exports.StartBlacklist = guard.ensure(['get', 'https'], startBlacklist);
