'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const lodash = require('lodash');

const TARGET_TECH = 'test.js';

module.exports = {

    /**
     *
     * @param {Object} blockData
     * @param {String} blockName - Название блока
     * @returns {*}
     */
    eachBlock: function(blockData, blockName) {
        return lodash.flatMap(blockData.entities, function(techs, entityId) {
            return techs[TARGET_TECH] && techs[TARGET_TECH].map(path => {
                return { entityId: entityId, path: path };
            });
        });
    },

    allBlocks: function(entities) {
        vow.all(entities.map(entity => {
            return vowFs
                .read(entity.path, 'utf8')
                .then(content => Object.assign({}, entity, { content: content }));
        }))
        .then(data => {
            console.log(`ready`);
            lodash.sortBy(data, ['entityId', 'path']).map(obj => console.log(`=====================\n${obj.path}\n\n${obj.content}`))
        });
    }
};
