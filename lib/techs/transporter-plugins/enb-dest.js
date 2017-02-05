'use strict';

const through = require('through2');

module.exports = function(deferred) {
    let result = [];

    return through.obj(
        function(file, encoding, cb) {
            result.push(file.contents);
            cb();
        },
        function(){
            deferred.resolve(result.join(''));
        });
};
