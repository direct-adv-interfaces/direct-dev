'use strict';

const lodash = require('lodash');
const bemWalk = require('bem-walk');
const bemConfig = require('bem-config')();
const bemNaming = require('bem-naming');

const WalkerConfig = require('../utils/config');

class WalkerData {

    constructor (targetBlockName, exclude) {
        this.blocks = {};
        this.targetBlockName = targetBlockName;
        this.exclude = [].concat(exclude || []);
    }

    _addTechPath(techs, tech, path) {
        let paths = techs[tech] || (techs[tech] = []);
        paths.push(path);
    }

    addFile(file) {
        let exclude = this.exclude;
        let entity = file.entity;

        let blockName = entity.block;
        if (this.targetBlockName && this.targetBlockName !== blockName) return;

        let entityId = bemNaming.stringify(entity);
        if (exclude.length && (exclude.indexOf(entityId) !== -1 || exclude.indexOf(blockName) !== -1)) return;

        let blocks = this.blocks;
        let block = blocks[blockName] || (blocks[blockName] = {
            techs: {},
            entities: {}
        });


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

module.exports = function(config, profileName, targetBlockName) {
    const walkerConfig = new WalkerConfig(config, profileName);
    const blocks = new WalkerData(targetBlockName, walkerConfig.exclude);
    const Handler = require(walkerConfig.handler);
    const handler = new Handler(walkerConfig.handlerConfig);

    bemWalk(walkerConfig.levels, { levels: bemConfig.levelMapSync() })
        .on('data', file => blocks.addFile(file))
        .on('end', () => blocks.apply(handler))
        .on('error', console.error.bind(console));
};
