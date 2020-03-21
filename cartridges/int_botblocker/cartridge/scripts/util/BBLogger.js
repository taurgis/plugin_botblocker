'use strict';

/* global require, exports */

/**
 * @module scripts/util/BBLogger
 *
 * This is a common script used for Logging purpose.
 * The log is written based on message type like debug, info or error.
 */

/**
 * This is a custom logger to log messages of all levels.
 *
 * @param {string} message : message to be logged
 * @param {string} severityLevel : level of message
 * @param {string} logLocation : location of class when error occured.
 */
function log(message, severityLevel, logLocation) {
    var Logger = require('dw/system/Logger');
    var loggerClass = 'plugin_botblocker';

    switch (severityLevel) {
        case 'debug':
            Logger.getLogger(loggerClass).debug(logLocation + ' : ' + message);
            break;
        case 'info':
            Logger.getLogger(loggerClass).info(logLocation + ' : ' + message);
            break;
        case 'error':
            Logger.getLogger(loggerClass).error(logLocation + ' : ' + message);
            break;
        default: // default case to fix eslint error
    }
}

/* Module Exports */
exports.log = log;
