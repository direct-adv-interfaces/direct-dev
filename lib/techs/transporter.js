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

function readFile(filePath, mapType) {
    return vowFs
        .read(filePath, 'utf8')
        .then(contents => ({
            path: filePath,
            contents,
            map: mapType ? createDummySourceMap(contents, { source: filePath, type: mapType }) : undefined
        }));
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
                        .pipe(enbDest(contents => {
                            let content = contents.code;

                            if (options.sourceMap) {
                                vowFs.write(sorceMapPath, JSON.stringify(contents.map))
                                    .then(function() {
                                        switch (options.sourceMap) {
                                            case 'js':
                                               content+= `\n//# sourceMappingURL=${sorceMapTarget}`;
                                               break;
                                            case 'css':
                                               content += `\n/*# sourceMappingURL=${sorceMapTarget} */`;
                                               break;
                                        }

                                        deferred.resolve(content);
                                    }).catch(deferred.reject.bind(deferred));
                            } else {
                                deferred.resolve(content);
                            }
                        }))
                });

            return deferred.promise();
        })
        .createTech();
};
