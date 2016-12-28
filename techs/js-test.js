'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const BlockFilter = require('../lib/block-filter');

module.exports = require('enb/lib/build-flow').create()
    .name('js-test')
    .target('target', '?.test.js')
    .defineOption('filter')
    .useFileList('test.js')
    .builder(function(paths) {
        let filter = this.getOption('filter', BlockFilter.empty);

        return vow.all(paths
            .filter(filter.enb)
            .map(file => {
                let filename = this.node.relativePath(file.fullname);

                return vowFs
                    .read(file.fullname, 'utf8')
                    .then(content => `/* begin: ${filename} */\n${content};\n/* end: ${filename} */`);
            })
        ).then(files => files.join('\n'));
    })
    .needRebuild(function() { return true; })
    .createTech();
