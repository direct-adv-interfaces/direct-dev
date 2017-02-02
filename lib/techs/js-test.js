'use strict';

/** [js-test](https://github.com/direct-adv-interfaces/direct-dev#js-test) */

const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const BlockFilter = require('../utils/block-filter');

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
    .createTech();
