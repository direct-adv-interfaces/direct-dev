'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const Vinyl = require('vinyl');
const Readable = require('stream').Readable;
const inherits = require('util').inherits;

function SrcLoader(paths, options) {
    if (!(this instanceof SrcLoader)) {
        return new SrcLoader(paths, options);
    }

    Readable.call(this, options);

    this.__paths = [].concat(paths || []);
}

inherits(SrcLoader, Readable);

SrcLoader.obj = function(paths, options) {
    options = options || {};
    options.objectMode = true;

    return new SrcLoader(paths, options);
};

SrcLoader.prototype._read = function () {
    vow.all(this.__paths.map(file => vowFs
            .read(file.fullname, 'utf8')
            .then(content => new Vinyl({
                  path: file.fullname,
                  contents: Buffer.from(content)
            }))
        ))
        .then(
            vinyls => {
                vinyls.forEach(file => { this.push(file); });
                this.push(null);
            },
            err => { process.nextTick(() => this.emit('error', err)); });
};

module.exports = SrcLoader;
