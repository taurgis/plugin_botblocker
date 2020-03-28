'use strict';

/**
 * Creates the local service to send a verification request
 * @param {Integer} numberOfBlacklists - The number of blacklists an IP should be on.
 *
 * @returns {dw.svc.Service} - The created service
 */
function createBlacklistService(numberOfBlacklists) {
    var ServiceRegistry = require('dw/svc/LocalServiceRegistry');

    return ServiceRegistry.createService('BotBlocker.BlacklistService', {
        createRequest: function (svc) {
            svc.setURL('https://raw.githubusercontent.com/stamparm/ipsum/master/levels/' + numberOfBlacklists + '.txt');
            svc.setRequestMethod('GET');
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                return client.text;
            }

            return false;
        },
        mockCall: function () {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                text: ''
            };
        }
    });
}


module.exports = {
    createVerificationService: createBlacklistService
};
