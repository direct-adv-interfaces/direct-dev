'use strict';

var through = require('through2');
var istanbul = require('istanbul');
var PluginError = require('gulp-util').PluginError;

var instrumenter = new istanbul.Instrumenter();

module.exports = function () {

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('coverage', 'Streams not supported!'));
        } else if (file.isBuffer()) {

            try {
                var code = file.contents.toString(encoding);
                var instrumented = instrumenter.instrumentSync(code, file.path);

                file.contents = Buffer.from(instrumented, encoding);

                return cb(null, file);
            } catch (ex) {
                return cb(ex);
            }
        }
    });
};