'use strict';
const ConsoleCoverageReporter = require('./console');

class HtmlCoverageReporter extends ConsoleCoverageReporter {

    constructor(config = {}) {
        super();
        config.dir && (this.options = { dir: config.dir });
    }

    get type() {
        return 'lcov';
    }
}

module.exports = HtmlCoverageReporter;
