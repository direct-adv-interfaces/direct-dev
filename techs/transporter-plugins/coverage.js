const through = require('through2');
const istanbul = require('istanbul');
const PluginError = require('gulp-util').PluginError;

let instrumenter = new istanbul.Instrumenter();

module.exports = function() {

    return through.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('coverage', 'Streams not supported!'));
        } else if (file.isBuffer()) {

            try {
                let code = file.contents.toString(encoding);
                let instrumented = instrumenter.instrumentSync(code, file.path);

                file.contents = Buffer.from(instrumented, encoding);

                return cb(null, file);
            } catch (ex) {
                return cb(ex);
            }
        }
    });
};
