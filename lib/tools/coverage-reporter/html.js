'use strict';
const istanbul = require('istanbul');

class HtmlCoverageReporter {
    constructor(config = {}) {
        this.path = config.path;
    }

    /**
     *
     * @param {Object[]} coverage
     */
    build(coverage) {
        const report = istanbul.Report.create('lcov', { dir: this.path });
        const collector = new istanbul.Collector();

        // todo@dima117a убрать копипаст (из других репортеров)
        coverage.forEach(item => collector.add(item));
        report.writeReport(collector, true);
    }
}

module.exports = HtmlCoverageReporter;
