'use strict';

var run = function () {
    var CacheMgr = require('dw/system/CacheMgr');
    var cBlackListCache = CacheMgr.getCache('bbBlacklisted');
    var args = arguments[0];
    var numberOfLists = args.ListCount;
    var blacklistService = require('../services/blackListService').createVerificationService(numberOfLists);

    var verificationResult = blacklistService.call().object;
    var blackListIPs = [];
    if (verificationResult) {
        blackListIPs = verificationResult.split(/\n/g);
    } else {
        blackListIPs = require('../blacklists/blacklist-3.json');
    }


    blackListIPs.forEach(function (ip) {
        cBlackListCache.put(ip, true);
    });
};

exports.Run = run;
