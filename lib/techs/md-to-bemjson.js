'use strict';

const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const BlockFilter = require('../utils/block-filter');
const Md2bemjson = require('md-to-bemjson');

module.exports = require('enb/lib/build-flow').create()
    .name('md-to-bemjson')
    .target('target', '?.bemjson.js')
    .defineOption('filter')
    .useFileList('md')
    .builder(function(paths) {
        let filter = this.getOption('filter', BlockFilter.empty);

        return vow.all(paths
            .filter(filter.enb)
            .map(file => {
                return vowFs
                    .read(file.fullname, 'utf8')
                    .then(content => Md2bemjson.convertSync(content));
            })
        ).then(files => JSON.stringify(files, null, 4));
    })
    .createTech();
