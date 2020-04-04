'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('useragent', function () {
    var UserAgentModel = proxyquire('../../../../../../cartridges/int_botblocker/cartridge/scripts/model/useragent', {
        'dw/system/CacheMgr': require('../../../../../mocks/dw/CacheMgr')
    });

    it('should save the User Agent string as its source', function () {
        var sUserAgentString = '123';
        var result = new UserAgentModel(sUserAgentString);
        assert.equal(result.source, sUserAgentString);
    });
});
