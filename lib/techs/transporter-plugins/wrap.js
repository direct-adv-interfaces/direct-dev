'use strict';

const through = require('through2');
const path = require('path');
const lodash = require('lodash');

/**
 * Добавляет заданные строки в начало и конец каждого файла
 * Доступны плейсхолдеры `${relative}` (относительный путь к текущему файлу) и `${path}` (абсолютный путь).
 * @param {Object} [options] - параметры обработчика
 * @param {String} [options.before] - строка, добавляемая в начало (по умолчанию - комментарий с ${relative}')
 * @param {String} [options.after] - строка, добавляемая в конец (по умолчанию - комментарий с ${relative}')
 * @returns {Stream}
 */
module.exports = function(options) {
    options = lodash.extend({ before: '\n/* begin: ${relative} */\n', after: '\n/* end: ${relative} */\n' }, options);
    options.before = lodash.template(options.before);
    options.after = lodash.template(options.after);

    return through.obj(function(file, encoding, cb) {

        // todo: испраивть определение относительного пути
        const args = { path: file.path, relative: file.path };
        const before = options.before(args);
        const after = options.after(args);

        file.contents = before + file.contents + after;

        return cb(null, file);
    });
};
