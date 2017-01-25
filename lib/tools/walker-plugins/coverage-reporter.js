'use strict';

const require2 = require('../../utils/require2');
const vow = require2('enb/node_modules/vow', 'vow');
const vowFs = require2('enb/node_modules/vow-fs', 'vow-fs');
const lodash = require('lodash');

const TARGET_TECH = 'test-result.json';

const reporters = {
    console: require('../coverage-reporter/console'),
    teamcity: require('../coverage-reporter/teamcity'),
    html: require('../coverage-reporter/html')
};

class WalkerCoverageReport {
    constructor(config = {}) {
        this.reporter = new reporters[config.reporter || 'console'](config);
    }

    /**
     *
     * @param {Object} blockData
     * @param {String} blockName - Название блока
     * @returns {*}
     */
    eachBlock(blockData, blockName) {
        return lodash
            .flatMap(blockData.entities, techs => techs[TARGET_TECH] || [])
            .map(path => this._readEntityFileAsync(path));
    }

    allBlocks(promises) {
        vow.all(promises).then(data => this.reporter.build(data));
    }

    _readEntityFileAsync(filePath) {
        return vowFs
            .read(filePath, 'utf8')
            .then(content => this._parseJson(content).coverage || {});
    }

    // todo@dima117a вынести в хелпер
    _parseJson(json, stub) {
        try {
            return JSON.parse(json);
        } catch (error) {
            return stub || { };
        }
    }
}

module.exports = WalkerCoverageReport;
