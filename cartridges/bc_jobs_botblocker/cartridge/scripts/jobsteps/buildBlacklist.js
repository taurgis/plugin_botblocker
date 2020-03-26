'use strict';

var run = function () {
    var CacheMgr = require('dw/system/CacheMgr');
    var cBlackListCache = CacheMgr.getCache('bbBlacklisted');
    var args = arguments[0];
    // var numberOfLists = args.ListCount;
    var blackListIPs = require('../blacklists/blacklist-3.json');

    blackListIPs.forEach(function (ip) {
        cBlackListCache.put(ip, true);
    });
};

exports.Run = run;
