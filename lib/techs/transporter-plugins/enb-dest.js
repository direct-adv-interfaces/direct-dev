'use strict';

const through = require('through2');
const SourceNode = require("source-map").SourceNode;
const SourceMapConsumer = require("source-map").SourceMapConsumer;

module.exports = function(callback) {
    let result = [];

    return through.obj(
        function(file, encoding, cb) {
            result.push(file);
            cb();
        },
        function(){
            let concatenated = new SourceNode();

            result.forEach(file => {

                if (file.map) {
                    let node = SourceNode.fromStringWithSourceMap(
                        file.contents,
                        new SourceMapConsumer(file.map),
                        file.path
                    );

                    concatenated.add(node);
                } else {
                    concatenated.add(file.contents);
                }
            });

            callback(concatenated.toStringWithSourceMap());
        });
};
