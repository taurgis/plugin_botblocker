'use strict';

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

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

exports.IPInformation = guard.ensure(['get', 'https'], IPInformation);
