'use strict';

require('buffer-v6-polyfill');

const through = require('through2');
const istanbul = require('istanbul');
const PluginError = require('gulp-util').PluginError;

let instrumenter = new istanbul.Instrumenter();

/**
 * Проверяет, нужно ли обрабатывать заданный файл
 * @function filterFunction
 * @param {Vinyl} file
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
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('coverage', 'Streams not supported!'));
        } else if (file.isBuffer()) {

            try {
                if (filter(file))
                {
                    let code = file.contents.toString(encoding);
                    let instrumented = instrumenter.instrumentSync(code, file.path);

                    file.contents = Buffer.from(instrumented, encoding);
                }

                return cb(null, file);
            } catch (ex) {
                return cb(ex);
            }
        }
    });
};
