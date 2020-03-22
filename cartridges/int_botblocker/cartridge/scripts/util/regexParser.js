'use strict';

var getRegexInstance = function (rawRegex) {
    var CacheMgr = require('dw/system/CacheMgr');
    var cache = CacheMgr.getCache('bbRegex');

    var cachedRegexInstance = cache.get(rawRegex);

    if (cachedRegexInstance) return cachedRegexInstance.value;

    var regexInstance = RegExp('(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:' + rawRegex + ')', 'i');

    cache.put(rawRegex, {
        value: regexInstance
    });

    return regexInstance;
};

var userAgentParser = function (rawRegex, userAgent) {
    // TODO: find out why it fails in some browsers
    try {
        var regexInstance = getRegexInstance(rawRegex);
        var match = regexInstance.exec(userAgent);

        return match ? match.slice(1) : null;
    } catch (e) {
        return null;
    }
};

module.exports = {
    userAgentParser: userAgentParser
};
