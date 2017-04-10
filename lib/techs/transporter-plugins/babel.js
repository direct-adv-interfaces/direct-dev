'use strict';
const through = require('through2');
const babel = require('babel');
const _ = require('lodash');


/*** Проверяет, нужно ли обрабатывать заданный файл
 * @function filterFunction * @param {Object} file
 * @param {String} file.path - полный путь к файлу
 * @returns {Boolean} */

/** * Обрабатывает бабелем заданные файлы
 * @param {Object} [options] - параметры обработчика
 * @param {filterFunction} [options.filter] - функция, фильтрующая обрабатываемые файлы. Если не задана, обрабатываются все файлы.
 * @param {Object} [options.babelOptions] - Параметры, которые нужно передать при вызове babel
 * @returns {Stream} */
module.exports = function(options = {}) {
    let { filter, babelOptions } = options;
    !filter && (filter = obj => true);

    return through.obj(function(file, encoding, cb) {
        try {
            if (filter(file)) {
                let finalOptions = _.merge(
                    { filenameRelative : file.path },
                    babelOptions || {}
                );
                file.contents = babel.transform(file.contents, finalOptions).code;
            }

            return cb(null, file);
        } catch (ex) {
            return cb(ex);
        }
    });
};
