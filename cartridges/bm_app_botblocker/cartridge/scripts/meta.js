'use strict';

/**
 * @module meta
 */

var Resource = require('dw/web/Resource');
var Logger = require('dw/system/Logger');
var URLUtils = require('dw/web/URLUtils');

var HOME_BREADCRUMB = {
    name: Resource.msg('global.home', 'locale', null),
    url: 'oops' // dw.web.URLUtils.httpHome()
};

/**
 * Constructor for metadata singleton
 *
 * This should be initialized via the current context object (product, category, asset or folder) and can
 * be used to retrieve the page metadata, breadcrumbs and to render the accumulated information to the client
 *
 * @class
 */
var Meta = function () {
    this.data = {
        page: {
            title: '',
            description: '',
            keywords: ''
        },
        // supports elements with properties name and url
        breadcrumbs: [HOME_BREADCRUMB],
        resources: {}
    };
};

Meta.prototype = {
    /**
     * The core method of this class which updates the internal data represenation with the given information
     *
     * @param  {Object|dw.catalog.Product|dw.catalog.Category|dw.content.Content|dw.content.Folder} object The object to update with
     *
     * @example
     * // using a product object
     * meta.update(product);
     * // using a plain object
     * meta.update({resources: {
     *     'MY_RESOURCE': dw.web.Resource.msg('my.resource', 'mybundle', null)
     * }});
     * // using a string
     * meta.update('account.landing')
     */
    update: function (object) {
        var curObject = object;
        // check if object wrapped in AbstractModel and get system object if so get the system object
        if ('object' in curObject) {
            curObject = curObject.object;
        }
        // check if it is a system object
        if (curObject.class) {
            // update metadata
            var title = null;
            if ('pageTitle' in curObject) {
                title = curObject.pageTitle;
            }
            if (!title && 'name' in curObject) {
                title = curObject.name;
            } else if (!title && 'displayName' in curObject) {
                title = curObject.displayName;
            }
            this.data.page.title = title;
            if ('pageKeywords' in curObject && curObject.pageKeywords) {
                this.data.page.keywords = curObject.pageKeywords;
            }
            if ('pageDescription' in curObject && curObject.pageDescription) {
                this.data.page.description = curObject.pageDescription;
            }

            this.updatePageMetaData();

            // Update breadcrumbs for content
            if (curObject.class === require('dw/content/Content')) {
                var path = require('~/cartridge/scripts/models/ContentModel').get(curObject).getFolderPath();
                this.data.breadcrumbs = path.map(function (folder) {
                    return {
                        name: folder.displayName
                    };
                });
                this.data.breadcrumbs.unshift(HOME_BREADCRUMB);
                this.data.breadcrumbs.push({
                    name: curObject.name,
                    url: URLUtils.url('Page-Show', 'cid', curObject.ID)
                });
                Logger.debug('Content breadcrumbs calculated: ' + JSON.stringify(this.data.breadcrumbs));
            }
        } else if (typeof curObject === 'string') {
            // @TODO Should ideally allow to pass something like account.overview, account.wishlist etc.
            // and at least generate the breadcrumbs & page title
        } else {
            if (curObject.pageTitle) {
                this.data.page.title = curObject.pageTitle;
            }
            if (curObject.pageKeywords) {
                this.data.page.keywords = curObject.pageKeywords;
            }
            if (curObject.pageDescription) {
                this.data.page.description = curObject.pageDescription;
            }
            // @TODO do an _.extend(this.data, object) of the passed object
        }
    },
    /**
     * Update the Page Metadata with the current internal data
     */
    updatePageMetaData: function () {
        var pageMetaData = request.pageMetaData;
        pageMetaData.title = this.data.page.title;
        pageMetaData.keywords = this.data.page.keywords;
        pageMetaData.description = this.data.page.description;
    },
    /**
     * Get the breadcrumbs for the current page
     *
     * @return {Array} an array containing the breadcrumb items
     */
    getBreadcrumbs: function () {
        return this.data.breadcrumbs || [];
    },
    /**
     * Adds a resource key to meta, the key of the given bundle is simply dumped to a data
     * attribute and can be consumed by the client.
     *
     * @example
     * // on the server
     * require('meta').addResource('some.message.key', 'bundlename');
     * // on the client
     * console.log(app.resources['some.message.key']);
     *
     * @param {string} key          The resource key
     * @param {string} bundle       The bundle name
     * @param {string} defaultValue Optional default value, empty string otherwise
     */
    addResource: function (key, bundle, defaultValue) {
        this.data.resources[key] = Resource.msg(key, bundle, defaultValue || '');
    },
    /**
     * Dumps the internally held data into teh DOM
     *
     * @return {string} A div with a data attribute containing all data as JSON
     */
    renderClientData: function () {
        return '<div class="page-context" data-dw-context="' + JSON.stringify(this.data) + '" />';
    }
};

/**
 * Singleton instance for meta data handling
 * @type {module:meta~Meta}
 */
module.exports = new Meta();
