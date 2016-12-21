module.exports = {
    techs: {
        devDeclaration: require('../techs/dev-declaration'),
        devPageBemjson: require('../techs/dev-page-bemjson'),
        jsTest: require('../techs/js-test'),
        transporter: require('../techs/transporter'),
        phantomTesting: require('../techs/phantom-testing'),
        sandbox: require('../techs/sandbox')
    },
    transporterPlugins: {
        wrap: require('../techs/transporter-plugins/wrap'),

        // todo@dima117a вынести логику фильтров в отдельный модуль
        bemFilter: require('../techs/transporter-plugins/bem-filter'),

        gulpIf: require('gulp-if'),
        debug: require('gulp-debug')
    }
};
