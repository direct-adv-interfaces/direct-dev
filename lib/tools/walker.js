'use  strict';

const lodash = require('lodash');
const path = require('path');
const bemWalk = require('bem-walk');
const bemNaming = require('bem-naming');
const bemConfig = require('bem-config')();

const WalkerConfig = require('../utils/config');

// const config = require(resolvePath('.direct-bundler.js'));
// const levels = config.levels;
//const generators = _.map(config.generators, require);

// function resolvePath (relativePath) {
//     return path.join(process.cwd(), relativePath);
// }

// function processFile(file) {
//     let blockName = file.entity.block;
//     let entityId = bemNaming.stringify(file.entity);
//     let block = this[blockName] || (this[blockName] = {
//             techs: {},
//             entities: {}
//         });
//     let entities = block.entities[entityId] || (block.entities[entityId] = {});
//
//     block.techs[file.tech] = true;
//     entities[file.tech] = true;
// }
//
// function processBlock(data, block) {
//     return _.flatMap(generators, gen => gen(block, data));
// }

module.exports = function(config, options) {
    //const blocks = {};
    const walkerConfig = new WalkerConfig(config, options.profile);

    console.log(walkerConfig.xxx);
    console.log(walkerConfig.yyy);

    // bemWalk(walkerConfig.levels, { levels: bemConfig.levelMapSync() })
    //     .on('data', processFile.bind(blocks))
    //     .on('error', console.error)
    //     .on('end', function() {
    //         let result = _.flatMap(blocks, processBlock).filter(Boolean);
    //         console.log(JSON.stringify(result, null, 2));
    //     });
};
