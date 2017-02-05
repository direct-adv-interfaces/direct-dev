'use strict';

const through = require('through2');
const istanbul = require('istanbul');

let instrumenter = new istanbul.Instrumenter();

/**
 * Проверяет, нужно ли обрабатывать заданный файл
 * @function filterFunction
 * @param {Object} file
 * @param {String} file.path - полный путь к файлу
 * @returns {Boolean}
 */

/**
 * Инструментирует код для подсчета статистики покрытия кода тестами
 * @param {Object} [options] - параметры обработчика
 * @param {filterFunction} [options.filter] - функция, фильтрующая обрабатываемые файлы. Если не задана, обрабатываются все файлы.
 * @returns {Stream}
 */
module.exports = function(options = {}) {
    let { filter } = options;

    !filter && (filter = obj => true);

    return through.obj(function(file, encoding, cb) {

        try {
            if (filter(file))
            {
                file.contents = instrumenter.instrumentSync(file.contents, file.path);
            }

            return cb(null, file);
        } catch (ex) {
            return cb(ex);
        }
    });
};
