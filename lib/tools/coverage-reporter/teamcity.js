'use strict';
const ConsoleCoverageReporter = require('./console');

class TeamcityCoverageReporter extends ConsoleCoverageReporter {

    get type() {
        return 'teamcity';
    }
}

module.exports = TeamcityCoverageReporter;
