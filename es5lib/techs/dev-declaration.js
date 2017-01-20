'use strict';

/** [dev-declaration](https://github.com/direct-adv-interfaces/direct-dev#dev-declaration) */

var bemNaming = require('bem-naming');

function parseEntity(entityString) {
    var entity = bemNaming.parse(entityString);
    var decl = { block: entity.block };

    entity.elem && (decl.elem = entity.elem);
    entity.modName && (decl.mod = entity.modName);
    entity.modVal && (decl.val = entity.modVal);

    return decl;
}

module.exports = require('enb/lib/build-flow').create().name('dev-declaration').target('target', '?.bemdecl.js').defineOption('entities', []).builder(function () {
    var entities = [].concat(this._entities || []).map(parseEntity);
    var json = JSON.stringify(entities, null, 4);

    return 'exports.deps = ' + json + ';\n';
}).createTech();