'use strict';

var through = require('through2');
var path = require('path');
var lodash = require('lodash');
var PluginError = require('gulp-util').PluginError;

module.exports = function (options) {
    options = Object.assign({ before: '\n/* begin: ${relative} */\n', after: '\n/* end: ${relative} */\n' }, options);
    options.before = lodash.template(options.before);
    options.after = lodash.template(options.after);

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('wrap', 'Streams not supported!'));
        } else if (file.isBuffer()) {
            var args = { path: file.path, relative: path.relative(file.cwd, file.path) };
            var before = new Buffer(options.before(args));
            var after = new Buffer(options.after(args));

            file.contents = Buffer.concat([before, file.contents, after]);

            return cb(null, file);
        }
    });
};