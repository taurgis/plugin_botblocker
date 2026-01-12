'use strict';

/**
 * Creates the local service to send a information request
 * @param {string} sIPAddress - The  IP Address to check
 *
 * @returns {dw.svc.Service} - The created service
 */
function createInformationService(sIPAddress) {
    var ServiceRegistry = require('dw/svc/LocalServiceRegistry');

    return ServiceRegistry.createService('BotBlocker.IPInformationService', {
        createRequest: function (svc) {
            svc.setURL('http://api.ipstack.com/' + sIPAddress + '?access_key=fc1fed2200de5790a70d7b200772d515&format=1');
            svc.setRequestMethod('GET');
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                return JSON.parse(client.text);
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
    createInformationService: createInformationService
};
