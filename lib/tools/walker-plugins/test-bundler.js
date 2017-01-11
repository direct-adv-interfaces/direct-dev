'use strict';

class TestBundler {
    constructor(config = {}) {

    }

    eachBlock(blockData, blockName) {
        let json = JSON.stringify(blockData, null, 2);
        console.log(`BLOCK: ${blockName}\n${json}\n`);

        return Object.keys(blockData.entities);
    }

    allBlocks(data) {
        console.log('ALL BLOCKS:\n' + JSON.stringify(data, null, 2));
    }
}

module.exports = TestBundler;
