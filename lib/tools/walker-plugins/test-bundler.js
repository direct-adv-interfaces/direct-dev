'use strict';

module.exports = {
    eachBlock: function(blockData, blockName) {
        let json = JSON.stringify(blockData, null, 2);
        console.log(`BLOCK: ${blockName}\n${json}\n`);

        return Object.keys(blockData.entities);
    },

    allBlocks: function(data) {
        console.log('ALL BLOCKS:\n' + JSON.stringify(data, null, 2));
    }
};
