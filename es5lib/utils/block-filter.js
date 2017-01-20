'use strict';

var path = require('path');
var lodash = require('lodash');
var bemNaming = require('bem-naming');
var pathIsInside = require('path-is-inside');
var levelUtils = require('./levels');

var defaultData = {
    targetBlock: undefined,
    targetLevels: undefined
};

var defaultOptions = {
    rootPath: process.cwd()
};

var filterFn = function filterFn(getPath, file) {
    var filePath = getPath(file);

    if (this.data.targetBlock) {
        var baseName = path.basename(filePath).split('.')[0];
        var entity = bemNaming.parse(baseName);

        if (entity.block !== this.data.targetBlock) {
            return false;
        }
    }

    if (this.data.targetLevels.length) {
        var checkPath = pathIsInside.bind(this, filePath);

        if (!this.data.targetLevels.some(checkPath)) {
            return false;
        }
    }

    return true;
};

/**
 * пример:
 *
 * var myFilter = new BlockFilter({ targetBlock: 'b1', targetLevels: [...] }, { rootPath: 'my/path' });
 * var filtered = paths.filter(myFilter);
 * var filtered = enbFiles.filter(myFilter.enb);
 * var filtered = vinyls.filter(myFilter.vinyl);
 *
 * @param data
 * @param options
 * @returns {function(this:BlockFilter)}
 * @constructor
 */
var BlockFilter = function BlockFilter(data, options) {
    this.data = Object.assign({}, defaultData, data);
    this.opts = Object.assign({}, defaultOptions, options);

    // преобразуем список уровней в абсолютные пути
    this.data.targetLevels = levelUtils.normalizeLevels(this.data.targetLevels, this.opts.rootPath).map(function (level) {
        return level.path;
    });

    var result = filterFn.bind(this, function (file) {
        return file;
    });

    result.enb = filterFn.bind(this, function (file) {
        return file.fullname;
    });
    result.vinyl = filterFn.bind(this, function (file) {
        return file.path;
    });

    return result;
};

BlockFilter.empty = function () {
    return true;
};
BlockFilter.empty.enb = function () {
    return true;
};
BlockFilter.empty.vinyl = function () {
    return true;
};

module.exports = BlockFilter;