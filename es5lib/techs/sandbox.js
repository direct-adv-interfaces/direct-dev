'use strict';

/**
 * sandbox
 * ===
 *
 * Собирает бандл для песочницы. Включает туда содержимое файлов .sandbox.js, обернутое
 * в служебный код песочницы.
 *
 * **Опции**
 *
 * * *String* [target] — Результирующий таргет. По умолчанию `?.sandbox.js`.
 * * *BlockFilter* [filter] — Фильтр по названию блока и уровням переопределения. По умолчанию - не указан.
 *
 * **Пример**
 *
 * ```javascript
 *
 *  const dev = require('direct-dev');
 *
 *  const filter = new dev.BlockFilter(
 *      { targetBlock: 'block-name', targetLevels: ['source.blocks'] },
 *      { rootPath: config.getRootPath() }
 *  );
 *
 *  nodeConfig.addTech(dev.techs.devPageBemjson, { target: '?.sandbox.js' });
 * ```
 */

var util = require('util');
var vow = require('vow');
var vowFs = require('vow-fs');
var BlockFilter = require('../utils/block-filter');

module.exports = require('enb/lib/build-flow').create().name('sandbox').target('target', '?.sandbox.js').defineOption('filter').useFileList('sandbox.js').builder(function (paths) {
    var node = this.node;
    var filter = this.getOption('filter', BlockFilter.empty);

    return vow.all(paths.filter(filter.enb).map(function (file) {
        return vowFs.read(file.fullname, 'utf8').then(function (data) {

            var filename = node.relativePath(file.fullname),
                src = util.format('(function(window) {' + 'var module = { exports: {} }, exports = module.exports; %s;' + '!window.SANDBOX && (window.SANDBOX = {});' + '!window.SANDBOX.blocks && (window.SANDBOX.blocks = []);' + 'window.SANDBOX.blocks.push(module.exports);' + '})(window);', data);

            return '/* begin: ' + filename + ' *' + '/\n' + src + '\n/* end: ' + filename + ' *' + '/';
        });
    })).then(function (contents) {
        return contents.join('\n');
    });
}).createTech();