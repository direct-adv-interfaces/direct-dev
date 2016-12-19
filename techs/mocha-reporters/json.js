/**
 * mocha JSON reporter
 * ===
 *
 * Формирует JSON с информацией о результатах выполнения тестов. Также включает в результат
 * информацию о покрытии кода тестами, если доступен объект window.__coverage__.
 *
 * **Пример**
 *
 * ```
 * $ node_modules/mocha-phantomjs/bin/mocha-phantomjs --reporter './mocha-reporters/json.js' path/to/file.html
 *
 * ```
 *
 * **Пример результата**
 *
 * ```javascript
 *  {
 *      result: {
 *          stats: { ... },
 *          tests: { ... },
 *          pending: { ... },
 *          failures: { ... },
 *          passes: { ... }
 *      },
 *      coverage: { ... }
 *  }
 * ```
 * */


/**
 * Module dependencies.
 */

var Base, log;

if (typeof window === 'undefined') {
    // running in Node
    Base = require('mocha').reporters.Base;
    log = console.log;
} else {
    // running in mocha-phantomjs
    Base = require('./base');
    log = function(msg) { process.stdout.write(msg + '\n'); };
}

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function JSONReporter(runner) {
    Base.call(this, runner);

    var self = this,
        tests = [],
        pending = [],
        failures = [],
        passes = [];

    runner.on('test end', function(test) {
        tests.push(test);
    });

    runner.on('pass', function(test) {
        passes.push(test);
    });

    runner.on('fail', function(test) {
        failures.push(test);
    });

    runner.on('pending', function(test) {
        pending.push(test);
    });

    runner.on('end', function() {
        var obj = {
            result: {
                stats: self.stats,
                tests: tests.map(clean),
                pending: pending.map(clean),
                failures: failures.map(clean),
                passes: passes.map(clean)
            },
            coverage: window.__coverage__
        };

        runner.testResults = obj;

        log(JSON.stringify(obj, null, 2));
    });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {Object} test
 * @return {Object}
 */
function clean(test) {
    return {
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration,
        err: errorJSON(test.err || {})
    };
}

/**
 * Transform `error` into a JSON object.
 *
 * @api private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON(err) {
    var res = {};
    Object.getOwnPropertyNames(err).forEach(
        function(key) {
            res[key] = err[key];
        }, err);
    return res;
}
