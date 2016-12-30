'use strict';

const buildFlow = require('enb/lib/build-flow');
const vow = require('vow');
const vowFs = require('vow-fs');
const Vinyl = require('vinyl');
const streamFromArray = require('stream-from-array');
const enbDest = require('./transporter-plugins/enb-dest');

module.exports = function(ext) {
    return buildFlow.create()
        .name('transporter')
        .target('target', '?.merged.js')
        .defineOption('apply')
        .useFileList(ext)
        .builder(function(paths) {

            return vow.all(paths
                .map(file => {
                    return vowFs
                        .read(file.fullname, 'utf8')
                        .then(content => new Vinyl({
                              path: file.fullname,
                              contents: Buffer.from(content)
                        }));
                })
            ).then(vinyls => {
                let deferred = vow.defer();

                this.getOption('apply', [])
                    .filter(Boolean)
                    .reduce((stream, plugin) => stream.pipe(plugin), streamFromArray.obj(vinyls))
                    .pipe(enbDest(deferred));

                return deferred.promise();
            });
        })
        .needRebuild(function() { return true; })
        .createTech();
};
