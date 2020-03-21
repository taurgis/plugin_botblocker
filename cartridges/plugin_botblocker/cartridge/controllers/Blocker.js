'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

/**
 * It blocks request and show error page
 */
server.get('Challenge', cache.applyDefaultCache, function (req, res, next) {
    res.render('error/ddresponse');

    next();
});

module.exports = server.exports();
