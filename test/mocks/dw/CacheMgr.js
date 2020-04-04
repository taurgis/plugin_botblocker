'use strict';

var cache = {

};

var CacheStore = function (id) {
    this.id = id;
};

CacheStore.prototype.put = function (key, value) {
    this.key = value;
};

CacheStore.prototype.get = function (key) {
    return this[key];
};


module.exports = {
    getCache: function (cacheID) {
        if (!cache[cacheID]) {
            cache[cacheID] = new CacheStore();
        }

        return cache[cacheID];
    }
};
