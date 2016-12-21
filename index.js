module.exports = {
    techs: {
        devDeclaration: require('./techs/dev-declaration'),
        devPageBemjson: require('./techs/dev-page-bemjson'),
        jsTest: require('./techs/js-test'),
        transporter: require('./techs/transporter'),
        phantomTesting: require('./techs/phantom-testing'),
        sandbox: require('./techs/sandbox')
    },
    transporterPlugins: {
        wrap: require('./techs/transporter-plugins/wrap'),
        debug: require('gulp-debug')
    }
};
