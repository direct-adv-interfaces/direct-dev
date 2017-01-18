/**
 * [dev-declaration](https://github.com/direct-adv-interfaces/direct-dev#dev-declaration)
 */

const bemNaming = require('bem-naming');

function parseEntity(entityString) {
    let entity = bemNaming.parse(entityString);
    let decl = { block: entity.block };

    entity.elem && (decl.elem = entity.elem);
    entity.modName && (decl.mod = entity.modName);
    entity.modVal && (decl.val = entity.modVal);

    return decl;
}

module.exports = require('enb/lib/build-flow').create()
    .name('dev-declaration')
    .target('target', '?.bemdecl.js')
    .defineOption('entities', [])
    .builder(function() {
        let entities = [].concat(this._entities || []).map(parseEntity);
        let json = JSON.stringify(entities, null, 4);

        return `exports.deps = ${json};\n`;
    })
    .createTech();
