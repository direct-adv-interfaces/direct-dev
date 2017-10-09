'use strict';

const stdoutWrite = process.stdout.write.bind(process.stdout);

const escape = function(str) {
    if (!str) return '';
    return str
        .toString()
        .replace(/\|/g, '||')
        .replace(/\n/g, '|n')
        .replace(/\r/g, '|r')
        .replace(/\[/g, '|[')
        .replace(/]/g, '|]')
        .replace(/:/g, '|0x003A')
        .replace(/@/g, '|0x0040')
        .replace(/\u0085/g, '|x')
        .replace(/\u2028/g, '|l')
        .replace(/\u2029/g, '|p')
        .replace(/'/g, '|\'');
};

const write = function(type, params) {
    let data = Object.keys(params).map(fld => `${escape(fld)}='${escape(params[fld])}'`).join(' ');
    stdoutWrite(`##teamcity[${escape(type)} ${data}]\n`);
};

module.exports = { write, stdoutWrite };
