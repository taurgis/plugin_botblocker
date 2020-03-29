/* eslint-disable no-unused-vars */

/**
 * Formats the URL view in tables.
 *
 * @param {string} value - The url
 * @param {integer} row - The current row
 *
 * @returns {string} - The formatted URL
 */
function urlFormatter(value, row) {
    return value.split('?')[0];
}

/**
 * Generates a detail view for a row on IP Details
 * @param {integer} index - The row index
 * @param {Object} row - The row
 *
 * @returns {string} - The HTML to show
 */
function detailFormatter(index, row) {
    var html = [];

    if (row[0].indexOf('?') > 0) {
        html.push('<div class="row">');
        var paramString = row[0].split('?')[1];
        var paramKeyValue = paramString.split('&');

        paramKeyValue.forEach((keyValue) => {
            var splitKeyValue = keyValue.split('=');

            html.push('<div class="col-3"><p><b>' + splitKeyValue[0] + ':</b> ' + splitKeyValue[1] + '</p></div>');
        });
        html.push('</div>');
    } else {
        html.push('No parameters');
    }


    return html.join('');
}

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

loadIPData();
