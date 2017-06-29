'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Формирует параметры сборки тестовых бандлов
 */
class TestBundler {

    /**
     *
     * @param config
     * @param config.targetJsonPath - Путь для сохранения результата в JSON
     * @param config.baseBundlePath - Папка, в которой нужно собирать бандлы
     * @param config.devEntities - Дополнительные БЭМ-сущности, которые нужно добавить в декларацию каждого бандла
     * @param config.defaultBundleConfig - Содержимое по умолчанию
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
