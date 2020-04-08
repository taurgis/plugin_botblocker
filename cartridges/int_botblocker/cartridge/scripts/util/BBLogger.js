'use strict';

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
            Logger.getLogger('botblocker', loggerClass).debug('[Bot Blocker][' + logLocation + '] : ' + message);
            break;
        case 'info':
            Logger.getLogger('botblocker', loggerClass).info('[Bot Blocker][' + logLocation + '] : ' + message);
            break;
        case 'warn':
            Logger.getLogger('botblocker', loggerClass).warn('[Bot Blocker][' + logLocation + '] : ' + message);
            break;
        case 'error':
            Logger.getLogger('botblocker', loggerClass).error('[Bot Blocker][' + logLocation + '] : ' + message);
            break;
        default: // default case to fix eslint error
    }
}

/* Module Exports */
exports.log = log;
