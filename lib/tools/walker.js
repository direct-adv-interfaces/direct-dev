'use  strict';

const lodash = require('lodash');
const bemWalk = require('bem-walk');
const bemConfig = require('bem-config')();
const bemNaming = require('bem-naming');

const WalkerConfig = require('../utils/config');

class WalkerData {

    constructor () {
        this.blocks = {};
    }

    addFile(file) {
        let blocks = this.blocks;
        let entity = file.entity;
        let blockName = entity.block;
        let block = blocks[blockName] || (blocks[blockName] = {
            techs: {},
            entities: {}
        });

        let entityId = bemNaming.stringify(entity);
        let entities = block.entities[entityId] || (block.entities[entityId] = {});

        block.techs[file.tech] = true;
        entities[file.tech] = true;
    }

    apply(plugin) {
        let result = this.blocks;

        plugin.eachBlock && (result = lodash.flatMap(result, plugin.eachBlock).filter(Boolean));
        plugin.allBlocks && plugin.allBlocks(result);
    }
}

module.exports = function(config, profileName) {
    const blocks = new WalkerData();
    const walkerConfig = new WalkerConfig(config, profileName);
    const handler = require(walkerConfig.handler);

    bemWalk(walkerConfig.levels, { levels: bemConfig.levelMapSync() })
        .on('data', file => blocks.addFile(file))
        .on('end', () => blocks.apply(handler))
        .on('error', console.error);
};
