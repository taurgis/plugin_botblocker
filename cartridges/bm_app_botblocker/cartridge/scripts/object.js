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
    var extendedTarget = target;
    var extendFunction = this.extend;
    if (!target) {
        return source;
    }

    Array(arguments).forEach(function (extendedSource) {
        Object.keys(extendedSource).forEach(function (prop) {
            // recurse for non-API objects
            if (extendedSource[prop] && typeof extendedSource[prop] === 'object' && !extendedSource[prop].class) {
                extendedTarget[prop] = extendFunction(extendedTarget[prop], extendedSource[prop]);
            } else {
                extendedTarget[prop] = extendedSource[prop];
            }
        });
    });

    return extendedTarget;
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
