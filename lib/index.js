'use strict';

module.exports = {
    BlockFilter: require('./utils/block-filter'),
    techs: {
        devDeclaration: require('./techs/dev-declaration'),
        devPageBemjson: require('./techs/dev-page-bemjson'),
        jsTest: require('./techs/js-test'),
        transporter: require('./techs/transporter'),
        phantomTesting: require('./techs/phantom-testing'),
        emptyTestResult: require('./techs/empty-test-result'),
        sandbox: require('./techs/sandbox')
    },
    transporterPlugins: {
        coverage: require('./techs/transporter-plugins/coverage'),
        wrap: require('./techs/transporter-plugins/wrap'),
        gulpIf: require('gulp-if'),
        debug: require('gulp-debug')
    }
};
