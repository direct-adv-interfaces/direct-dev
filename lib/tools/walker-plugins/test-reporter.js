'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const lodash = require('lodash');

const TARGET_TECH = 'test-result.json';
const reporters = {
    console: require('../test-reporters/console'),
    teamcity: require('../test-reporters/teamcity')
};

class WalkerTestReport {
    constructor(config = {}) {
        this.reporter = new reporters[config.reporter || 'console']();
    }

    /**
     *
     * @param {Object} blockData
     * @param {String} blockName - Название блока
     * @returns {*}
     */
    eachBlock(blockData, blockName) {
        return lodash.flatMap(blockData.entities, function(techs, entityId) {
            return techs[TARGET_TECH] && techs[TARGET_TECH].map(path => {
                return { entityId: entityId, path: path };
            });
        });
    }

    allBlocks(entities) {
        vow.all(entities.map(entity => this._readEntityFileAsync(entity)))
            .then(data => this._writeReport(lodash.sortBy(data, ['entityId', 'path'])));
    }

    _readEntityFileAsync(entity) {
        return vowFs
            .read(entity.path, 'utf8')
            .then(content => Object.assign({}, entity, { content: content }));
    }

    _writeReport(entities) {
        let stat = entities.reduce((stat, entity) => {
            let result = this._parseJson(entity.content, { result: { stats: { fatal: 1 } } }).result;

            Object.keys(stat).forEach(key => {
                stat[key] += result.stats[key] || 0;
            });

            this.reporter.beginSuite(entity.entityId);
            result.passes && result.passes.forEach(obj => this.reporter.test(obj));
            result.failures && result.failures.forEach(obj => this.reporter.test(obj));
            result.pending && result.pending.forEach(obj => this.reporter.test(obj));
            result.stats.fatal && this.reporter.fatal();
            this.reporter.endSuite(entity.entityId, result.stats);

            return stat;
        }, { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0, duration: 0 });

        this.reporter.stats(stat);
    }

    _parseJson(json, stub) {
        try {
            return JSON.parse(json);
        } catch (error) {
            return stub || { };
        }
    }
}

module.exports = WalkerTestReport;
