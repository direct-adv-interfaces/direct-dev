/**
 * @classdesc Abstract class representing walker plugin
 * @class BaseWalkerPlugin
 */
class BaseWalkerPlugin {
    /**
     * @constructs
     * @param config
     * @param config.targetJsonPath
     * @param config.baseBundlePath
     * @param config.devEntities
     * @param config.defaultBundleConfig
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * Method which is being called on each block
     * @abstract
     *
     * @param {Object} blockData
     * @param {string} blockName
     *
     * @returns {*}
     */
    eachBlock(blockData, blockName) {}

    /**
     * Method which is being called when all blocks have been called
     * @abstract
     *
     * @param {Object} data
     */
    allBlocks(data) {}
}

module.exports = BaseWalkerPlugin;
