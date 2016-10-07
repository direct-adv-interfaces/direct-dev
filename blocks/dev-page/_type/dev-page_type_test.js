// Добавляет в window интерфейсы для описания тестов (describe и пр.)
if (typeof window.initMochaPhantomJS === 'function') {
    window.initMochaPhantomJS();
}
mocha.ui('bdd');
mocha.setup({ timeout: 10000 });

window.expect || (window.expect = chai.expect);

(function() {
    var origCallPhantom = window.callPhantom;

    // хак для запуска бандла блока без тестов https://github.com/nathanboktae/mocha-phantomjs-core/issues/5
    // без него выбрасывается исключение "mocha.run() was called with no tests"
    window.callPhantom = function(arg) {
        if (arg && typeof arg.testRunStarted !== 'undefined') {
            arg.testRunStarted === 0 && (arg.testRunStarted = 1);
            window.callPhantom = origCallPhantom;
        }

        origCallPhantom(arg);
    };
})();
