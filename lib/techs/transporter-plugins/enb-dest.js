'use strict';

const through = require('through2');
const SourceNode = require("source-map").SourceNode;

module.exports = function(deferred) {
    let result = [];

    return through.obj(
        function(file, encoding, cb) {
            result.push(file);
            cb();
        },
        function(){
            let concatenated = new SourceNode();

            result.forEach(f => concatenated.add(f.contents));

            let contents = concatenated.toStringWithSourceMap();
            let map = new Buffer(JSON.stringify(contents.map)).toString('base64');

            deferred.resolve(`${contents.code}\n//# sourceMappingURL=data:application/json;base64,${map}`);
        });
};
