const levels = ['../blocks', 'common.blocks', 'desktop.blocks'];
const transporterPlugins = require('../../lib/index').transporterPlugins;
const techs = {
    dev: require('../../lib/index').techs,
    bem: require('enb-bem-techs'),
    enb: {
        provideFile: require('enb/techs/file-provider'),
        browserJs: require('enb-js/techs/browser-js'),
        css: require('enb-css/techs/css')
    },
    xjst: {
        bemjsonToHtml: require('enb-bemxjst/techs/bemjson-to-html'),
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    }
};

const BlockFilter = require('../../lib/block-filter');

module.exports = function(config) {

    const filter = new BlockFilter(
        { targetBlock: 'b1', targetLevels: ['desktop.blocks'] },
        { rootPath: config.getRootPath() }
    );

    config.nodes('*.bundles/*', function(nodeConfig) {

        nodeConfig.addTechs([

            // bundle endpoint
            [techs.dev.devDeclaration, { entities: ['dev-page', 'dev-page_type_test', 'b1', 'b2', 'input__el1', 'select_theme_islands'] }],
            [techs.dev.devPageBemjson, { type: 'test', js: '?.js', devJs: '?.test.js', css: '?.css' }],
            //[techs.enb.provideFile, { target: '?.bemdecl.js' }],

            // essential
            [techs.bem.levels, { levels: levels }],
            [techs.bem.depsOld],
            [techs.bem.files],

            // dev bundles
            [techs.dev.sandbox],
            [techs.dev.jsTest, { filter: filter }],
            //[techs.dev.phantomTesting],
            [techs.dev.emptyTestResult, { coverage: true, filter: filter }],

            [techs.xjst.bemhtml],
            //[techs.enb.browserJs, { target: '?.js' }],
            [techs.dev.transporter('js'), {
                target: '?.js',
                apply: [
                    transporterPlugins.gulpIf(
                        filter.vinyl, // фильтр блоков
                        transporterPlugins.coverage()), // считаем coverage
                    transporterPlugins.wrap({ before: '\n// # outer-begin\n', after: '\n// # outer-end\n' })
                ]
            }],
            [techs.enb.css],

            [techs.xjst.bemjsonToHtml, { target: '?.sandbox.html',  bemjsonFile: '?.sandbox.bemjson.js' }],
            [techs.xjst.bemjsonToHtml, { target: '?.html',  bemjsonFile: '?.bemjson.js' }]
        ]);

        //nodeConfig.addTargets(['?.sandbox.html', '?.test.html', '?.js', '?.css', '?.sandbox.js', '?.test.js']);
        nodeConfig.addTargets(['?.phantomjs']);
    });
};
