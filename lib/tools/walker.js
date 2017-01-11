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

    _addTechPath(techs, tech, path) {
        let paths = techs[tech] || (techs[tech] = []);
        paths.push(path);
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
        let entityTechs = block.entities[entityId] || (block.entities[entityId] = {});

        // add file path
        this._addTechPath(block.techs, file.tech, file.path);
        this._addTechPath(entityTechs, file.tech, file.path);
    }

    apply(plugin) {
        let result = this.blocks;

        plugin.eachBlock && (result = lodash
            .flatMap(result, (value, key) => plugin.eachBlock(value, key))
            .filter(Boolean));

        plugin.allBlocks && plugin.allBlocks(result);
    }
}

module.exports = function(config, profileName) {
    const blocks = new WalkerData();
    const walkerConfig = new WalkerConfig(config, profileName);
    const Handler = require(walkerConfig.handler);
    const handler = new Handler(walkerConfig.handlerConfig);

    bemWalk(walkerConfig.levels, { levels: bemConfig.levelMapSync() })
        .on('data', file => blocks.addFile(file))
        .on('end', () => blocks.apply(handler))
        .on('error', console.error);
};
