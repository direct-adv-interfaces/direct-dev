'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const lodash = require('lodash');
const Reporter = require('../test-reporters/console-reporter');

const TARGET_TECH = 'test-result.json';

function readEntityFileAsync(entity) {
    return vowFs
        .read(entity.path, 'utf8')
        .then(content => Object.assign({}, entity, { content: content }));
}

function parseJson(json, stub) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return stub || { };
    }
}

function writeReport(entities) {
    let reporter = new Reporter();
    let stat = entities.reduce(function(stat, entity) {
        let result = parseJson(entity.content).result;

        Object.keys(stat).forEach(key => {
            stat[key] += result.stats[key] || 0;
        });

        reporter.beginSuite(entity.entityId);
        result.passes && result.passes.forEach(obj => reporter.test(obj));
        result.failures && result.failures.forEach(obj => reporter.test(obj));
        result.pending && result.pending.forEach(obj => reporter.test(obj));
        result.stats.fatal && reporter.fatal();
        reporter.endSuite(entity.entityId, result.stats);

        return stat;
    }, { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0, duration: 0 });

    reporter.stats(stat);
}

module.exports = {

    /**
     *
     * @param {Object} blockData
     * @param {String} blockName - Название блока
     * @returns {*}
     */
    eachBlock: function(blockData, blockName) {
        return lodash.flatMap(blockData.entities, function(techs, entityId) {
            return techs[TARGET_TECH] && techs[TARGET_TECH].map(path => {
                return { entityId: entityId, path: path };
            });
        });
    },

    allBlocks: function(entities) {
        vow.all(entities.map(readEntityFileAsync))
            .then(data => writeReport(lodash.sortBy(data, ['entityId', 'path'])));
    }
};
