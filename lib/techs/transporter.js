'use strict';

/** [transporter](https://github.com/direct-adv-interfaces/direct-dev#transporter) */

const buildFlow = require('enb/lib/build-flow');
const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const lodash = require('lodash');
const enbSrc = require('./transporter-plugins/enb-src');
const enbDest = require('./transporter-plugins/enb-dest');

module.exports = function(ext) {
    return buildFlow.create()
        .name(`transporter: ${ext}`)
        .target('target', '?.merged.js')
        .defineOption('apply')
        .useFileList(ext)
        .builder(function(files) {
            let deferred = vow.defer();
            let plugins = [].concat(this.getOption('apply', []).filter(Boolean));

            plugins
                .reduce((stream, plugin) => stream.pipe(plugin), enbSrc.obj(files))
                .pipe(enbDest(deferred));

            return deferred.promise();
        })
        .createTech();
};
