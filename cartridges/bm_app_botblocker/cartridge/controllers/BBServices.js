'use strict';

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var CacheMgr = require('dw/system/CacheMgr');

/**
 * Renders the location information of an IP using an external service.
 */
function IPInformation() {
    var sIPInformationService = require('../scripts/services/ipInformationService').createInformationService(request.httpParameterMap.ip.stringValue);
    var data = sIPInformationService.call().object;

    app.getView({
        information: data
    }).render('botblocker/iplogging/ipinformation');
}

/**
 * Blacklist an IP
 */
function BlackListIP() {
    var sIPAddress = request.httpParameterMap.ip.stringValue;

    if (sIPAddress) {
        var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
        var IPBlackListMgr = require('*/cartridge/scripts/managers/IPBlacklistMgr');
        var IPAddress = require('*/cartridge/scripts/model/ipAddress');
        var UserAgent = require('*/cartridge/scripts/model/useragent');
        var oIP = IPMgr.getIPAddress(sIPAddress);
        var oUserAgent = new UserAgent(JSON.parse(oIP.custom.userAgent).source);
        oUserAgent.parse();

        if (oIP) {
            var cBlackListCache = CacheMgr.getCache('bbBlacklisted');

            IPBlackListMgr.saveIPAddress(new IPAddress(oIP.custom.IP, oIP.custom.count, oIP.custom.count), oUserAgent);
            cBlackListCache.invalidate(sIPAddress);
        }
    }
}

/**
 * Whitelist an IP address
 */
function WhiteListIP() {
    var sIPAddress = request.httpParameterMap.ip.stringValue;

    if (sIPAddress) {
        var IPMgr = require('*/cartridge/scripts/managers/IPMgr');
        var IPBlackListMgr = require('*/cartridge/scripts/managers/IPBlacklistMgr');
        var IPAddress = require('*/cartridge/scripts/model/ipAddress');
        var UserAgent = require('*/cartridge/scripts/model/useragent');
        var oIP = IPMgr.getIPAddress(sIPAddress);
        var oUserAgent = new UserAgent(JSON.parse(oIP.custom.userAgent).source);
        oUserAgent.parse();

        if (oIP) {
            var cBlackListCache = CacheMgr.getCache('bbBlacklisted');

            IPBlackListMgr.whitelist(new IPAddress(oIP.custom.IP, oIP.custom.count, oIP.custom.count), oUserAgent);
            cBlackListCache.invalidate(sIPAddress);
        }
    }
}

exports.IPInformation = guard.ensure(['get', 'https'], IPInformation);
exports.BlackListIP = guard.ensure(['post', 'https'], BlackListIP);
exports.WhiteListIP = guard.ensure(['post', 'https'], WhiteListIP);
