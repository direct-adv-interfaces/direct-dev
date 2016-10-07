var levels = ['desktop.blocks', '../blocks'],
    techs = {
        dev: require('../../index').techs,
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

    config.nodes('*.bundles/*', function(nodeConfig) {

        nodeConfig.addTechs([
            [techs.dev.devPageBemjson, { target: '?.sandbox.bemjson.js', type: 'sandbox', js: '?.js', devJs: '?.sandbox.js', css: '?.css' }],
            [techs.dev.devPageBemjson, { target: '?.test.bemjson.js', type: 'test', js: '?.js', devJs: '?.test.js', css: '?.css' }],
            [techs.dev.devPageBemjson, { js: '?.js', css: '?.css' }],
            [techs.dev.sandbox],

            [techs.enb.provideFile, { target: '?.bemdecl.js' }],
            [techs.bem.levels, { levels: levels }],
            [techs.bem.depsOld],
            [techs.bem.files],
            [techs.xjst.bemhtml],
            [techs.enb.browserJs, { target: '?.js' }],
            [techs.enb.css],

            [techs.xjst.bemjsonToHtml, { target: '?.sandbox.html',  bemjsonFile: '?.sandbox.bemjson.js' }],
            [techs.xjst.bemjsonToHtml, { target: '?.test.html',  bemjsonFile: '?.test.bemjson.js' }]
        ]);

        nodeConfig.addTargets(['?.sandbox.html', '?.test.html', '?.js', '?.css', '?.sandbox.js']);
    });
};
