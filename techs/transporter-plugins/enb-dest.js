const through = require('through2');
const PluginError = require('gulp-util').PluginError;

module.exports = function(deferred) {
    let result = [];

    return through.obj(
        function(file, encoding, cb) {
            if (file.isNull()) {
                cb();
                return;
            }

            if (file.isStream()) {
                cb(new PluginError('wrap', 'Streams not supported!'));
                return;
            }

            file.isBuffer() && (result.push(file.contents.toString(encoding)));

            cb();
        },
        function(){
            deferred.resolve(result.join(''));
        });
};
