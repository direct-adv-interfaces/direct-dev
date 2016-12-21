'use strict';

const path = require('path');
const lodash = require('lodash');
const bemNaming = require('bem-naming');
const pathIsInside = require('path-is-inside');

module.exports = {
    /**
     * Возвращает функцию для фильтрации путей к файлам по уровням и по названию блока
     * @param {Object} filter - параметры фильтра
     * @param {String[]} [filter.targetLevels] - параметры фильтра
     * @param {String} [filter.targetBlock] - параметры фильтра
     * @param {Function} [getPath] - функция, возвращающая путь для заданного объекта
     * @returns {Function}
     */
    createFilter: function(filter, getPath) {
        const targetLevels = filter.targetLevels;
        const targetBlock = filter.targetBlock;

        return function(file) {
            let filePath = getPath ? getPath(file) : file;

            console.log(`apply filter to file: ${filePath}`);

            if (targetBlock) {
                let baseName = path.basename(filePath).split('.')[0];
                let entity = bemNaming.parse(baseName);

                if (entity.block !== targetBlock) {
                    console.log(`decline by blockName (${entity.block})`);
                    return false;
                }
            }

            if (targetLevels.length && !lodash.some(targetLevels, pathIsInside.bind(this, filePath))) {
                console.log(`decline by level`);
                return false;
            }

            console.log(`success!!`);
            return true;
        };
    },

    // todo@dima117a вынести логику фильтров в отдельный модуль
    normalizeLevel: function(rootPath, level) {
        typeof level === 'string' && (level = { path: level });
        return path.resolve(rootPath, level.path);
    }
};
