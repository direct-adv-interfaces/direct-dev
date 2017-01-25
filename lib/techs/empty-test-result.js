'use strict';

const require2 = require('../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const istanbul = require('istanbul');

const BlockFilter = require('../utils/block-filter');

function createEmptyResultString(coverage) {
    const now = new Date();

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

module.exports = require('enb/lib/build-flow').create()
    .name('empty-test-result')
    .target('target', '?.test-result.json')
    .defineOption('coverage')
    .defineOption('filter')
    .useFileList('js')
    .builder(function(paths) {
        const needCoverage = this.getOption('coverage', false);
        const filter = this.getOption('filter', BlockFilter.empty);

        if (needCoverage) {

            return vow.all(paths
                .filter(filter.enb)
                .map(file => vowFs
                    .read(file.fullname, 'utf8')
                    .then(content =>{
                        const instrumenter = new istanbul.Instrumenter({ embedSource: true });
                        instrumenter.instrumentSync(content, file.fullname);
                        return instrumenter.lastFileCoverage();
                    }))
            ).then(coverages =>createEmptyResultString(
                coverages.reduce(function(resultCoverage, coverage) {
                    resultCoverage[coverage.path] = coverage;
                    return resultCoverage;
                }, {})));
        } else {
            return createEmptyResultString();
        }
    })
    .createTech();
