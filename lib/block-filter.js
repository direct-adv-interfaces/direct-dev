'use strict';

const path = require('path');
const lodash = require('lodash');
const bemNaming = require('bem-naming');
const pathIsInside = require('path-is-inside');
const techUtils = require('./utils');

const defaultData = {
    targetBlock: undefined,
    targetLevels: undefined
};

const defaultOptions = {
    rootPath: process.cwd()
};

const filterFn = function(getPath, file) {
    let filePath = getPath(file);

    if (this.data.targetBlock) {
        let baseName = path.basename(filePath).split('.')[0];
        let entity = bemNaming.parse(baseName);

        if (entity.block !== this.data.targetBlock) {
            return false;
        }
    }

    if (this.data.targetLevels.length) {
        let checkPath = pathIsInside.bind(this, filePath);

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
const BlockFilter = function(data, options) {
    this.data = Object.assign({}, defaultData, data);
    this.opts = Object.assign({}, defaultOptions, options);

    // преобразуем список уровней в абсолютные пути
    this.data.targetLevels = techUtils
        .normalizeLevels(this.data.targetLevels, this.opts.rootPath)
        .map(level => level.path);

    const result = filterFn.bind(this, file => file);

    result.enb = filterFn.bind(this, file => file.fullname);
    result.vinyl = filterFn.bind(this, file => file.path);

    return result;
};

BlockFilter.empty = () => true;
BlockFilter.empty.enb = () => true;
BlockFilter.empty.vinyl = () => true;

module.exports = BlockFilter;
