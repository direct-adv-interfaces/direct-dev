'use strict';

const fs = require('fs');
const path = require('path');

class TestBundler {

    /**
     *
     * @param config
     * @param config.targetJsonPath
     * @param config.baseBundlePath
     * @param config.devEntities
     * @param config.defaultBundleConfig
     */
    constructor(config = {}) {
        this.config = config;
    }

    eachBlock(blockData, blockName) {
        return Object.assign({}, this.config.defaultBundleConfig, {
            block: blockName,
            path: path.join(this.config.baseBundlePath, blockName),
            entities: [].concat(this.config.devEntities || []).concat(Object.keys(blockData.entities)),
            hasTests: !!blockData.techs['test.js']
        });
    }

    allBlocks(data) {
        fs.writeFile(
            this.config.resultPath,
            JSON.stringify(data, null, 4),
            err => { err && console.log(err) }
        );
    }
}

module.exports = TestBundler;
