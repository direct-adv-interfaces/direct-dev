'use strict';

const path = require('path');

/**
 * Возвращает объект с полем path, путь преобразуется в абсолютный
 * @param {String|Object} level - информация об уровне переопределения
 * @param {String} rootPath - путь к корневой папке проекта (относительно него разрешаются относительные пути)
 * @returns {Object}
 */
function normalizeLevel(level, rootPath) {
    typeof level === 'string' && (level = { path: level });

    level.path = path.resolve(rootPath, level.path);

    return level;
}

/**
 * Нормализуеи массив уровней с помощью функции normalizeLevel
 * @param {String|Object|String[]|Object[]} levels - уровни переопределения
 * @param {String} rootPath - путь к корневой папке проекта (относительно него разрешаются относительные пути)
 * @returns {Object[]}
 */
function normalizeLevels(levels, rootPath) {
    return [].concat(levels || [])
        .map(level => normalizeLevel(level, rootPath));
}

module.exports = {
    normalizeLevel: normalizeLevel,
    normalizeLevels: normalizeLevels
};
