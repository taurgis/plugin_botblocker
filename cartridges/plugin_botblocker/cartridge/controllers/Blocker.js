'use strict';

var server = require('server');

/**
 * It blocks request and show error page
 */
server.get('Challenge', function (req, res, next) {
    res.render('error/ddresponse');

    next();
});

module.exports = server.exports();
