'use strict';

const buildFlow = require('enb/lib/build-flow');
const vow = require('vow');
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

            this.getOption('apply', [])
                .filter(Boolean)
                .reduce((stream, plugin) => stream.pipe(plugin), enbSrc.obj(files))
                .pipe(enbDest(deferred));

            return deferred.promise();
        })
        .needRebuild(function() { return true; })
        .createTech();
};
