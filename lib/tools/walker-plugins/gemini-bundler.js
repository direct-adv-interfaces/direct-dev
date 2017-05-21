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
        return (blockData.techs.gemini || []).reduce((acc, techPath) => {
            return acc.concat(fs.readdirSync(techPath).map((fileName) => {
                return Object.assign({}, this.config.defaultBundleConfig, {
                    block: blockName,
                    path: path.join(techPath, fileName)
                });
            }));

        }, []);
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
