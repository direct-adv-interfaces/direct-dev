'use strict';

var vow = require('vow');
var vowFs = require('vow-fs');
var Vinyl = require('vinyl');
var Readable = require('stream').Readable;
var inherits = require('util').inherits;

function SrcLoader(paths, options) {
    if (!(this instanceof SrcLoader)) {
        return new SrcLoader(paths, options);
    }

    Readable.call(this, options);

    this.__paths = [].concat(paths || []);
}

inherits(SrcLoader, Readable);

SrcLoader.obj = function (paths, options) {
    options = options || {};
    options.objectMode = true;

    return new SrcLoader(paths, options);
};

SrcLoader.prototype._read = function () {
    var _this = this;

    vow.all(this.__paths.map(function (file) {
        return vowFs.read(file.fullname, 'utf8').then(function (content) {
            return new Vinyl({
                path: file.fullname,
                contents: Buffer.from(content)
            });
        });
    })).then(function (vinyls) {
        vinyls.forEach(function (file) {
            _this.push(file);
        });
        _this.push(null);
    }, function (err) {
        process.nextTick(function () {
            return _this.emit('error', err);
        });
    });
};

module.exports = SrcLoader;