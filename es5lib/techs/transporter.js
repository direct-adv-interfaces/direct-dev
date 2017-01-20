'use strict';

var buildFlow = require('enb/lib/build-flow');
var vow = require('vow');
var enbSrc = require('./transporter-plugins/enb-src');
var enbDest = require('./transporter-plugins/enb-dest');

module.exports = function (ext) {
    return buildFlow.create().name('transporter: ' + ext).target('target', '?.merged.js').defineOption('apply').useFileList(ext).builder(function (files) {
        var deferred = vow.defer();

        this.getOption('apply', []).filter(Boolean).reduce(function (stream, plugin) {
            return stream.pipe(plugin);
        }, enbSrc.obj(files)).pipe(enbDest(deferred));

        return deferred.promise();
    }).createTech();
};