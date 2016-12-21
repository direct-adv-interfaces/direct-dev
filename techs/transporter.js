'use strict';

const buildFlow = require('enb/lib/build-flow');
const vow = require('vow');
const gulp = require('gulp');
const enbDest = require('./transporter-plugins/enb-dest');

module.exports = function(ext) {
    return buildFlow.create()
        .name('transporter')
        .target('target', '?.merged.js')
        .defineOption('apply')
        .useFileList(ext)
        .builder(function(files) {
            let deferred = vow.defer(),
                paths = files.filter(file => !file.isDirectory).map(file => file.fullname);

            this.getOption('apply', [])
                .reduce((stream, el) => stream.pipe(el), gulp.src(paths))
                .pipe(enbDest(deferred));

            return deferred.promise();
        })
        .needRebuild(function() { return true; })
        .createTech();
};
