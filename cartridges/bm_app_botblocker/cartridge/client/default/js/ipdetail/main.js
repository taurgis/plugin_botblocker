'use strict';

/**
 * Fetches more information about the IP
 */
function loadIPData() {
    var sIPAddressURL = $('#ipaddress').data('informationservice');
    $.get(sIPAddressURL, function (data) {
        if (data) {
            $('#ipinformation').append(data);
        }
    });
}

module.exports = {
    initClicks: () => {
        $(document).on('click', '.js-blacklist, .js-whitelist', (event) => {
            var $button = $(event.target);
            $.post($button.data('actionurl'), () => {
                window.location.reload(true);
            });
        });
    },
    loadIPData: loadIPData
};
