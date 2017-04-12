'use strict';

/** [transporter](https://github.com/direct-adv-interfaces/direct-dev/TECHS.md#transporter) */

const buildFlow = require('enb/lib/build-flow');
const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const lodash = require('lodash');
const streamify = require('stream-array');
const enbDest = require('./transporter-plugins/enb-dest');

const SourceNode = require("source-map").SourceNode;

const cache = {};

function readFile(filePath, useSourceMap) {
    return vowFs
        .read(filePath, 'utf8')
        .then(contents => ({
            path: filePath,
            contents,
            map: useSourceMap ? new SourceNode(null, null, null, contents) : undefined
        }));
}

function getCachedFile(filePath) {
    return cache[filePath] || (cache[filePath] = readFile(filePath));
}

function provideStream(paths, useSourceMap) {
    return vow
        .all(paths.map(file => readFile(file.fullname, useSourceMap)))
        .then(files => streamify(files), err => { console.log(err)});
}

module.exports = function(ext, options = {}) {
    let transporter = buildFlow.create()
        .name(`transporter: ${ext}`)
        .target('target', '?.merged.js')
        .defineOption('apply')
        .useFileList(ext);

    options.noCache && (transporter = transporter.needRebuild(lodash.constant(true)));

    return transporter
        .builder(function(files) {
            let deferred = vow.defer();
            let plugins = [].concat(this.getOption('apply', [])).filter(Boolean);

            provideStream(files, options.useSourceMap)
                .then(fStream => {
                    plugins
                        .reduce((stream, plugin) => stream.pipe(plugin), fStream)
                        .pipe(enbDest(deferred))
                });

            return deferred.promise();
        })
        .createTech();
};
