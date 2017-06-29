'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Формирует параметры сборки тестовых бандлов
 */
class TestBundler {

    /**
     * @param config - Настройки плаигна
     * @param config.targetJsonPath - Путь для сохранения результата в JSON
     * @param config.baseBundlePath - Папка, в которой нужно собирать бандлы
     * @param config.devEntities - Дополнительные БЭМ-сущности, которые нужно добавить в декларацию каждого бандла
     * @param config.defaultBundleConfig - Содержимое по умолчанию
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * Формирует результат для отдельного блока
     * @param {Object} blockData - Информация о блоке
     * @param {Object} blockData.techs - Технологии, в которых реализован блок (ключ - технология, значение - массив путей к файлам)
     * @param {Object} blockData.entities - БЭМ-сущности блока (ключ - ID БЭМ-сущности, значение - объект, аналогичный полю "techs", но для конкретной БЭМ-сущности)
     * @param {String} blockName - Название блока
     * @return {*}
     */
    eachBlock(blockData, blockName) {
        return Object.assign({}, this.config.defaultBundleConfig, {
            block: blockName,
            path: path.join(this.config.baseBundlePath, blockName),
            entities: [].concat(this.config.devEntities || []).concat(Object.keys(blockData.entities)),
            hasTests: !!blockData.techs['test.js']
        });
    }

    /**
     * Формирует общий результат для всех блоков
     * @param {Object[]} data - Массив объектов, полученных из метода "eachBlock"
     */
    allBlocks(data) {
        fs.writeFile(
            this.config.resultPath,
            JSON.stringify(data, null, 4),
            err => { err && console.log(err) }
        );
    }
}

module.exports = TestBundler;
