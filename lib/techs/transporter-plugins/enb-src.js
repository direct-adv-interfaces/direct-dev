'use strict';

require('buffer-v6-polyfill');

const fs = require('fs');
const Readable = require('readable-stream').Readable;
const inherits = require('util').inherits;

function SrcLoader(paths, options) {
    if (!(this instanceof SrcLoader)) {
        return new SrcLoader(paths, options);
    }

    Readable.call(this, options);

    this.__paths = [].concat(paths || []).reverse();
}

inherits(SrcLoader, Readable);

SrcLoader.obj = function(paths, options) {
    options = options || {};
    options.objectMode = true;

    return new SrcLoader(paths, options);
};

SrcLoader.prototype._read = function () {
    let file = this.__paths.pop();

    if (file)
    {
        try {
            this.push({
                path: file.fullname,
                contents: fs.readFileSync(file.fullname, { encoding: 'utf-8' })
            });
        } catch(err) {
            process.nextTick(() => this.emit('error', err));
        }
    } else {
        this.push(null);
    }
};

module.exports = SrcLoader;
