'use strict';
const istanbul = require('istanbul');

class ConsoleCoverageReporter {

    get type() {
        return 'text-summary';
    }

    /**
     *
     * @param {Object[]} coverage
     */
    build(coverage) {
        const report = istanbul.Report.create(this.type, this.options);
        const collector = new istanbul.Collector();

        coverage.forEach(item => collector.add(item));
        report.writeReport(collector, true);
    }
}

module.exports = ConsoleCoverageReporter;
