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
    loadIPData: loadIPData
};
