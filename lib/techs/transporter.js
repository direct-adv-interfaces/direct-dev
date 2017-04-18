'use strict';

/** [transporter](https://github.com/direct-adv-interfaces/direct-dev/TECHS.md#transporter) */

const buildFlow = require('enb/lib/build-flow');
const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const lodash = require('lodash');
const streamify = require('stream-array');
const enbDest = require('./transporter-plugins/enb-dest');

const createDummySourceMap = require("source-map-dummy");

const cache = {};

function readFile(filePath, sourceMap) {
    return vowFs
        .read(filePath, 'utf8')
        .then(contents => ({
            path: filePath,
            contents,
            map: sourceMap ? createDummySourceMap(contents, { source: filePath, type: "js"}) : undefined
        }));
}

function getCachedFile(filePath) {
    return cache[filePath] || (cache[filePath] = readFile(filePath));
}

function provideStream(paths, sourceMap) {
    return vow
        .all(paths.map(file => readFile(file.fullname, sourceMap)))
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
            let sorceMapTarget = this._target + '.map';
            let sorceMapPath = this.node.resolvePath(this._target) + '.map';

            provideStream(files, options.sourceMap)
                .then(fStream => {
                    plugins
                        .reduce((stream, plugin) => stream.pipe(plugin), fStream)
                        .pipe(enbDest((contents) => {
                            let map = JSON.stringify(contents.map);
                            
                            vowFs.write(sorceMapPath, map).then(() => {
                                let content;

                                switch (options.sourceMap) {
                                    case 'js':
                                        content = contents.code + `\n//# sourceMappingURL=${sorceMapTarget}`;
                                        break;
                                    case 'css':
                                        content = contents.code + `\n /*# sourceMappingURL=${sorceMapTarget} */`;

                                        break;
                                    default:
                                        content = contents.code;
                                        break;
                                }

                                deferred.resolve(content);
                            }).catch(e => {
                                deferred.reject(e);
                            });
                        }))
                });

            return deferred.promise();
        })
        .createTech();
};
