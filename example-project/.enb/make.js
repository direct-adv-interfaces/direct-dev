const levels = ['../blocks', 'common.blocks', 'desktop.blocks'];
const directDev = require('../../lib/index');
const transporterPlugins = directDev.transporterPlugins;
const techs = {
    dev: directDev.techs,
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

module.exports = function(config) {

    const filter = new directDev.BlockFilter(
        { targetBlock: 'b1', targetLevels: ['desktop.blocks'] },
        { rootPath: config.getRootPath() }
    );

    config.nodes('desktop.bundles/index', function(nodeConfig) {

        nodeConfig.addTechs([

            // bundle endpoint
            //[techs.dev.devDeclaration, { entities: ['dev-page', 'dev-page_type_test', 'b1', 'b2', 'input__el1', 'select_theme_islands'] }],
            [techs.dev.devDeclaration, { entities: ['dev-page', 'b1', 'b2', 'input__el1', 'select_theme_islands'] }],
            [techs.dev.devPageBemjson, { type: 'test', js: '?.js', devJs: '?.test.js', css: '?.css' }],
            //[techs.enb.provideFile, { target: '?.bemdecl.js' }],

            // essential
            [techs.bem.levels, { levels: levels }],
            [techs.bem.depsOld],
            [techs.bem.files],

            // dev bundles
            [techs.dev.sandbox],
            [techs.dev.jsTest, { filter: filter }],
            [techs.dev.phantomTesting],
            //[techs.dev.emptyTestResult(true), { filter: filter }],

            [techs.xjst.bemhtml],
            //[techs.enb.browserJs, { target: '?.js' }],
            [techs.dev.transporter('js', { noCache: true, useSourceMap: true }), {
                target: '?.js',
                apply: [
                    transporterPlugins.coverage({ filter: filter.vinyl }),
                    transporterPlugins.wrap(
                        { before: '\n// # outer-begin ${relative}\n', after: '\n// # outer-end ${relative}\n' })
                ]
            }],
            [techs.enb.css],

            [techs.xjst.bemjsonToHtml, { target: '?.sandbox.html',  bemjsonFile: '?.sandbox.bemjson.js' }],
            [techs.xjst.bemjsonToHtml, { target: '?.html',  bemjsonFile: '?.bemjson.js' }]
        ]);

        //nodeConfig.addTargets(['?.sandbox.html', '?.test.html', '?.js', '?.css', '?.sandbox.js', '?.test.js']);
        nodeConfig.addTargets(['?.test-result.json']);
        //nodeConfig.addTargets(['?.js']);
    });
};
