'use strict';

/** [dev-declaration](https://github.com/direct-adv-interfaces/direct-dev#phantom-testing) */

var vow = require('vow'),
    vowFs = require('vow-fs'),
    path = require('path'),
    exec = require('child_process').exec,
    phantomPath = require.resolve('.bin/phantomjs'),
    mochaPhantomjsPath = require.resolve('mocha-phantomjs-core'),
    mochaReporterPath = require.resolve('./mocha-reporters/json.js'),
    MAX_PHANTOM_INSTANCES = require('os').cpus().length,
    phantomQueue = [],
    phantomInstancesCount = 0,
    runAsync = function(cmd) {

        var deferred = vow.defer(),
            proc = exec(cmd);


        phantomInstancesCount++;

        // proc.stdout.on('data', function() {
        //    console.log(arguments);
        // });

        proc.stderr.on('data', function(err) {
            console.log('ERROR: %s', err);
        });

        proc.on('exit', function (exitCode) {
            phantomInstancesCount--;
            phantomQueue.length && phantomQueue.shift()();
            deferred.resolve(exitCode);
        });

        return deferred.promise();
    };

module.exports = require('enb/lib/build-flow').create()
    .name('phantom-testing')
    .target('target', '?.test-result.json')
    .dependOn('html', '?.html')
    .defineOption('tmpTarget', '?.test-result.tmp')
    .methods({
        resolveTargetPath: function(target) {
            let nodePath = this.node.getPath();
            let targetFileName = this.node.unmaskNodeTargetName(nodePath, target);

            return this.node.resolvePath(targetFileName);
        }
    })
    .builder(function() {
        let sourceTargetFilePath = this.resolveTargetPath(this._html),
            tmpTargetFilePath = this.resolveTargetPath(this._tmpTarget),
            deferred = vow.defer(),
            config = JSON.stringify({
                ignoreResourceErrors: true,
                file: tmpTargetFilePath,
                settings: {
                    loadImages: false,
                    webSecurityEnabled: false
                }
            }),
            cmd = `${phantomPath} '${mochaPhantomjsPath}' '${sourceTargetFilePath}' '${mochaReporterPath}' '${config}'`;

        function runPhantom() {
            runAsync(cmd)
                .then(function() {
                    return vowFs
                        .read(tmpTargetFilePath, 'utf8')
                        .fail(function() {
                            return JSON.stringify({ result: { stats: { fatal: 1} } });
                        });
                })
                .then(deferred.resolve, deferred);
        }

        phantomInstancesCount < MAX_PHANTOM_INSTANCES ?
            runPhantom() :
            phantomQueue.push(runPhantom);

        return deferred.promise();
    })
    .needRebuild(function() { return true })
    .createTech();
