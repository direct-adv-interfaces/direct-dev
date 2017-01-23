'use strict';

const through = require('through2');
const path = require('path');
const lodash = require('lodash');
const PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
    options = lodash.extend({ before: '\n/* begin: ${relative} */\n', after: '\n/* end: ${relative} */\n' }, options);
    options.before = lodash.template(options.before);
    options.after = lodash.template(options.after);

    return through.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('wrap', 'Streams not supported!'));
        } else if (file.isBuffer()) {
            const args = { path: file.path, relative: path.relative(file.cwd, file.path) };
            const before = new Buffer(options.before(args));
            const after = new Buffer(options.after(args));

            file.contents = Buffer.concat([before, file.contents, after]);

            return cb(null, file);
        }
    });
};
