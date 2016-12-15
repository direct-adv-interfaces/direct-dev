'use strict';

var vow = require('vow'),
    vowFs = require('vow-fs'),
    path = require('path'),
    pathIsInside = require('path-is-inside');

function getArrayOption(ctx, name) {
    return [].concat(ctx.getOption(name, []));
}

function normalizeLevel(level) {
    typeof level === 'string' && (level = { path: level });
    return path.resolve(this.getRootDir(), level.path);
}
module.exports = require('enb/lib/build-flow').create()
    .name('js-test')
    .target('target', '?.test.js')
    .defineOption('targetLevels')
    .defineOption('targetEntities')
    .defineOption('targetBlock')
    .useFileList('test.js')
    .needRebuild(function(){ return true;})
    .prepare(function() {
        this.options = {
            targetBlock: this.getOption('targetBlock', undefined),
            targetEntities: getArrayOption(this, 'targetEntities'),
            targetLevels: getArrayOption(this, 'targetLevels')
                .map(normalizeLevel.bind(this.node))
        };
    })
    .builder(function(paths) {
        let node = this.node;

        return vow.all(paths.map(function(file) {
            var filename = node.relativePath(file.fullname);

            return vowFs.read(file.fullname, 'utf8').then(function(data) {
                return `/* begin: ${filename} */\n${data};\n/* end: ${filename} */`;
            });

        })).then(function(contents) {
            return contents.join('\n');
        });
    })
    .createTech();
