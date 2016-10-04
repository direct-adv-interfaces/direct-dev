var techs = require('../../index').techs;

module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {

        nodeConfig.addTechs([
            [techs.devPageBemjson, { target: '?.examples.bemjson.js', type: 'examples', js: ['?.js'], css: ['?.css'] }],
            [techs.devPageBemjson, { target: '?.test.bemjson.js', type: 'test', js: ['?.js', '?.test.js'] }],
            [techs.devPageBemjson, { js: ['?.js'], css: ['?.css'] }]
        ]);

        nodeConfig.addTargets(['?.examples.bemjson.js', '?.test.bemjson.js', '?.bemjson.js']);
    });
};
