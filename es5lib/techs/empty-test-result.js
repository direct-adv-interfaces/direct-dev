'use strict';

var vow = require('vow');
var vowFs = require('vow-fs');
var istanbul = require('istanbul');

var BlockFilter = require('../utils/block-filter');

function createEmptyResultString(coverage) {
    var now = new Date();

    return JSON.stringify({
        result: {
            stats: { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0, start: now, end: now, duration: 0 },
            tests: [],
            pending: [],
            failures: [],
            passes: []
        },
        coverage: coverage
    }, null, 2);
}

module.exports = require('enb/lib/build-flow').create().name('empty-test-result').target('target', '?.test-result.json').defineOption('coverage').defineOption('filter').useFileList('js').builder(function (paths) {
    var needCoverage = this.getOption('coverage', false);
    var filter = this.getOption('filter', BlockFilter.empty);

    if (needCoverage) {

        return vow.all(paths.filter(filter.enb).map(function (file) {
            return vowFs.read(file.fullname, 'utf8').then(function (content) {
                var instrumenter = new istanbul.Instrumenter({ embedSource: true });
                instrumenter.instrumentSync(content, file.fullname);
                return instrumenter.lastFileCoverage();
            });
        })).then(function (coverages) {
            return createEmptyResultString(coverages.reduce(function (resultCoverage, coverage) {
                resultCoverage[coverage.path] = coverage;
                return resultCoverage;
            }, {}));
        });
    } else {
        return createEmptyResultString();
    }
}).createTech();