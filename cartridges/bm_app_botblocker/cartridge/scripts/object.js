'use strict';

/**
 * @module object
 */

/**
 * Deep copies all all object properties from source to target
 *
 * @param {Object} target The target object which should be extended
 * @param {Object} source The object for extension
 * @return {Object} - The extended object
 */
exports.extend = function (target, source) {
    var adaptedSource;
    var adaptedTarget = target;

    if (!adaptedTarget) {
        return source;
    }

    // eslint-disable-next-line no-plusplus
    for (var i = 1; i < arguments.length; i++) {
        adaptedSource = arguments[i];
        // eslint-disable-next-line no-restricted-syntax
        for (var prop in adaptedSource) {
            // recurse for non-API objects
            if (adaptedSource[prop] && typeof adaptedSource[prop] === 'object' && !adaptedSource[prop].class) {
                adaptedTarget[prop] = this.extend(adaptedTarget[prop], adaptedSource[prop]);
            } else {
                adaptedTarget[prop] = adaptedSource[prop];
            }
        }
    }

    return adaptedTarget;
};


/**
 * Access given properties of an object recursively
 *
 * @param {Object} object The object
 * @param {string} propertyString The property string, i.e. 'data.myValue.prop1'
 * @return {Object} The value of the given property or undefined
 * @example
 * var prop1 = require('~/object').resolve(obj, 'data.myValue.prop1')
 */
exports.resolve = function (object, propertyString) {
    var result = object;
    var propPath = propertyString.split('.');

    propPath.forEach(function (prop) {
        if (result && prop in result) {
            result = result[prop];
        } else {
            result = undefined;
        }
    });
    return result;
};
