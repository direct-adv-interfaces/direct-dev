'use strict';

const lodash = require('lodash');
const teamcity = require('../../utils/teamcity');

const reporters = {
    console: str => console.log(str),
    teamcity: str => teamcity.write('message', { text: str, status: 'ERROR' })
};

/**
 * Проверяет, что в проекте нет блоков с именами из заданного списка
 */
class TestBundler {

    /**
     * @param config - Настройки плаигна
     * @param config.names - Массив запрещенных названий блоков
     * @param config.reporter - формат вывода результата: console|teamcity
     */
    constructor(config = {}) {
        let names = [].concat(config.names || []);
        this.names = lodash.keyBy(names);

        this.reporter = reporters[config.reporter] || reporters.console;
    }

    /**
     * Формирует результат для отдельного блока
     * @param {Object} blockData - Информация о блоке
     * @param {String} blockName - Название блока
     * @return {*}
     */
    eachBlock(blockData, blockName) {
        return this.names[blockName] && blockName;
    }

    /**
     * Формирует общий результат для всех блоков
     * @param {Object[]} data - Массив объектов, полученных из метода "eachBlock"
     */
    allBlocks(data) {
        this.reporter(`forbidden block names: ${data.join(', ')}`);
    }
}

module.exports = TestBundler;
