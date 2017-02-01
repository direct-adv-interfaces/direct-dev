'use strict';

const chalk = require('chalk');
const write = console.log.bind(console);

class ConsoleReporter {
    constructor() {

    }

    beginSuite(name) { }

    endSuite(name, suite) {
        const color = (suite.failures || suite.fatal) ? chalk.red : chalk.gray;

        let msg = `finish suite: ${name}, duration: ${suite.duration}ms, test count: ${suite.tests}`;
        suite.failures && (msg += `, failed: ${suite.failures}`);

        write(color(msg));
        write(chalk.gray('===================================================='));
    }

    test(test) {
        if (test.err.message) {
            write(chalk.red(`test: ${test.fullTitle}`));
            write(chalk.gray(test.err.message));
            write(chalk.gray(test.err.stack));
        }
    }

    fatal() {
        write(chalk.red('failed to start'));
    }

    stats(stats) {
        write(`Total test count: ${stats.tests}, total duration: ${stats.duration}ms`);
        write(chalk.green(`\tsuccessful: ${stats.passes}`));

        stats.fatal && write(chalk.red(`\tfailed to start: ${stats.fatal} `+ (stats.fatal == 1 ? 'block' : 'blocks')))

        write(chalk.red(`\tfailed: ${stats.failures}`));
        write(chalk.gray(`\tignored: ${stats.pending}`));
    }
}

module.exports = ConsoleReporter;
