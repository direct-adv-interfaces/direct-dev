'use strict';

/** [js-test](https://github.com/direct-adv-interfaces/direct-dev/TECHS.md#js-test) */

// const require2 = require('../utils/require2');
// const vow = require2('enb/node_modules/vow', 'vow');
// const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
// const BlockFilter = require('../utils/block-filter');

module.exports = require('enb/lib/build-flow').create()
    .name('dummy')
    .target('target', '?.dummy')
    .defineOption('content')
    .builder(function() {
        return this.getOption('content', '');
    })
    .createTech();
