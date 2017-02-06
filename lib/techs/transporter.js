'use strict';

/** [transporter](https://github.com/direct-adv-interfaces/direct-dev#transporter) */

const buildFlow = require('enb/lib/build-flow');
const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const lodash = require('lodash');
const streamify = require('stream-array');
const enbDest = require('./transporter-plugins/enb-dest');

const cache = {};

function readFile(filePath) {
    return vowFs
        .read(filePath, 'utf8')
        .then(contents => ({ path: filePath, contents }));
}

function getCachedFile(filePath) {
    return cache[filePath] || (cache[filePath] = readFile(filePath));
}

function provideStream(paths) {
    return vow
        .all(paths.map(file => getCachedFile(file.fullname)))
        .then(files => streamify(files), err => { console.log(err)});
}

module.exports = function(ext) {
    return buildFlow.create()
        .name(`transporter: ${ext}`)
        .target('target', '?.merged.js')
        .defineOption('apply')
        .useFileList(ext)
        .builder(function(files) {
            let deferred = vow.defer();
            let plugins = [].concat(this.getOption('apply', [])).filter(Boolean);

            provideStream(files)
                .then(fStream => {
                    plugins
                        .reduce((stream, plugin) => stream.pipe(plugin), fStream)
                        .pipe(enbDest(deferred))
                });

            return deferred.promise();
        })
        .createTech();
};
