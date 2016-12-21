const through = require('through2');
const PluginError = require('gulp-util').PluginError;

module.exports = function(deferred) {
    let result = [];

    return through.obj(
        function(file, enc, cb) {
            if (file.isNull()) return cb(null, file);

            if (file.isStream()) {
                this.emit('error', new PluginError('wrap', 'Streams not supported!'));
            } else {
                file.isBuffer() && (result.push(file.contents.toString(enc)));
                cb(null, file);
            }
        },
        function(){
            deferred.resolve(result.join(''));
        });
};
