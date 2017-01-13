'use strict';
const istanbul = require('istanbul');

class ConsoleCoverageReporter {
    constructor() {

    }

    /**
     *
     * @param {Object[]} coverage
     */
    build(coverage) {
        // todo@dima117a убрать копипаст (из других репортеров)
        const report = istanbul.Report.create('text-summary');
        const collector = new istanbul.Collector();

        coverage.forEach(item => collector.add(item));
        report.writeReport(collector, true);
    }
}

module.exports = ConsoleCoverageReporter;
