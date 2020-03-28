'use strict';

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

/**
 * Renders the general TFD page.
 */
function start() {
    app.getView({
    	mainmenuname: request.httpParameterMap.mainmenuname.value,
    	CurrentMenuItemId: request.httpParameterMap.CurrentMenuItemId.value
    }).render('bb/start');
}


exports.Start = guard.ensure(['get', 'https'], start);
