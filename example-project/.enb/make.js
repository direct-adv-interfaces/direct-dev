var techs = require('../../index').techs;

module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [techs.devBemjson, { target: '?.dev.bemjson.js', bemjson: { block: 'xxx' } }],
            [techs.devBemjson, { target: '?.test.bemjson.js', bemjson: { block: 'yyy' } }]
        ]);

        nodeConfig.addTargets(['?.dev.bemjson.js', '?.test.bemjson.js']);
    });
};
