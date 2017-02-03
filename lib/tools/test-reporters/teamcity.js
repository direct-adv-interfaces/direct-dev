'use strict';

const stdoutWrite = process.stdout.write.bind(process.stdout);

const escape = function(str) {
    if (!str) return '';
    return str
        .toString()
        .replace(/\|/g, '||')
        .replace(/\n/g, '|n')
        .replace(/\r/g, '|r')
        .replace(/\[/g, '|[')
        .replace(/]/g, '|]')
        .replace(/:/g, '|0x003A')
        .replace(/@/g, '|0x0040')
        .replace(/\u0085/g, '|x')
        .replace(/\u2028/g, '|l')
        .replace(/\u2029/g, '|p')
        .replace(/'/g, '|\'');
};

const write = function(type, params) {
    let data = Object.keys(params).map(fld => `${escape(fld)}='${escape(params[fld])}'`).join(' ');
    stdoutWrite(`##teamcity[${escape(type)} ${data}]\n`);
};


class TeamcityReporter {
    constructor() {

    }

    beginSuite(name) {
        write('testSuiteStarted', { name: name });
    }

    endSuite(name, suite) {
        write('testSuiteFinished', { name: name, duration: suite.duration });
    }

    test(test) {

        if (test.hasOwnProperty('duration')) {
            write('testStarted', { name: test.fullTitle });

            if (Object.keys(test.err).length) {
                // failed
                write('testFailed', {
                    name: test.title,
                    message: test.err.message,
                    details: test.err.stack && test.err.stack.split('\n').slice(1).join('\n')
                });
            } else {
                // successful
                stdoutWrite('Test finished successfully\n');
            }

            write('testFinished', { name: test.fullTitle, duration: test.duration });
        } else {
            // ignored
            write('testIgnored', { name: test.fullTitle, message: 'pending' });
        }
    }

    fatal() {
        write('message', { text: 'failed to start', status: 'ERROR' });
    }

    stats() { }

    buildFailed() {
        write('message', { text: 'Tests failed', status: 'ERROR' });
    }
}

module.exports = TeamcityReporter;
