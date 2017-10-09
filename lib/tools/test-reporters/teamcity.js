'use strict';

const teamcity = require('../../utils/teamcity');

class TeamcityReporter {
    constructor() {

    }

    beginSuite(name) {
        teamcity.write('testSuiteStarted', { name: name });
    }

    endSuite(name, suite) {
        teamcity.write('testSuiteFinished', { name: name, duration: suite.duration });
    }

    test(test) {

        if (test.hasOwnProperty('duration')) {
            teamcity.write('testStarted', { name: test.fullTitle });

            if (Object.keys(test.err).length) {
                // failed
                teamcity.write('testFailed', {
                    name: test.title,
                    message: test.err.message,
                    details: test.err.stack && test.err.stack.split('\n').slice(1).join('\n')
                });
            } else {
                // successful
                teamcity.stdoutWrite('Test finished successfully\n');
            }

            teamcity.write('testFinished', { name: test.fullTitle, duration: test.duration });
        } else {
            // ignored
            teamcity.write('testIgnored', { name: test.fullTitle, message: 'pending' });
        }
    }

    fatal() {
        teamcity.write('message', { text: 'failed to start', status: 'ERROR' });
    }

    stats() { }

    buildFailed() {
        teamcity.write('message', { text: 'Tests failed', status: 'ERROR' });
    }
}

module.exports = TeamcityReporter;
