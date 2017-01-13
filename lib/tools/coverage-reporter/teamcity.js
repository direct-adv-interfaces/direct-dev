'use strict';
const istanbul = require('istanbul');

class TeamcityCoverageReporter {
    constructor() {

    }

    /**
     *
     * @param {Object[]} coverage
     */
    build(coverage) {
        // todo@dima117a убрать копипаст (из других репортеров)
        const report = istanbul.Report.create('teamcity');
        const collector = new istanbul.Collector();

        coverage.forEach(item => collector.add(item));
        report.writeReport(collector, true);
    }
}

module.exports = TeamcityCoverageReporter;
