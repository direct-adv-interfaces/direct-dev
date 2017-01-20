'use strict';

/** [dev-declaration](https://github.com/direct-adv-interfaces/direct-dev#js-test) */

var vow = require('vow');
var vowFs = require('vow-fs');
var BlockFilter = require('../utils/block-filter');

module.exports = require('enb/lib/build-flow').create().name('js-test').target('target', '?.test.js').defineOption('filter').useFileList('test.js').builder(function (paths) {
    var _this = this;

    var filter = this.getOption('filter', BlockFilter.empty);

    return vow.all(paths.filter(filter.enb).map(function (file) {
        var filename = _this.node.relativePath(file.fullname);

        return vowFs.read(file.fullname, 'utf8').then(function (content) {
            return '/* begin: ' + filename + ' */\n' + content + ';\n/* end: ' + filename + ' */';
        });
    })).then(function (files) {
        return files.join('\n');
    });
}).createTech();