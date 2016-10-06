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
            [techs.dev.devPageBemjson, { target: '?.examples.bemjson.js', type: 'examples', js: '?.js', css: '?.css' }],
            [techs.dev.devPageBemjson, { target: '?.test.bemjson.js', type: 'test', js: '?.js', devJs2: '?.test.js', css: '?.css' }],
            [techs.dev.devPageBemjson, { js: '?.js', css: '?.css' }],

            [techs.enb.provideFile, { target: '?.bemdecl.js' }],
            [techs.bem.levels, { levels: levels }],
            [techs.bem.depsOld],
            [techs.bem.files],
            [techs.xjst.bemhtml],
            [techs.enb.browserJs, { target: '?.js' }],
            [techs.enb.css],

            [techs.xjst.bemjsonToHtml, { target: '?.examples.html',  bemjsonFile: '?.examples.bemjson.js' }],
            [techs.xjst.bemjsonToHtml, { target: '?.test.html',  bemjsonFile: '?.test.bemjson.js' }]
        ]);

        nodeConfig.addTargets(['?.examples.html', '?.test.html', '?.js', '?.css']);
    });
};
