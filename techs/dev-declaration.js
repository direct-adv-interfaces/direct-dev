const bemNaming = require('bem-naming');

module.exports = require('enb/lib/build-flow').create()
    .name('dev-declaration')
    .target('target', '?.bemdecl.js')
    .defineOption('entities')
    .needRebuild(function(){ return true; })
    .methods({
        /**
         * Возвращает массив значений для заданной опции технологии
         * - если значение - не массив, создает массив из одного элемента
         * - если значение не задано, возвращает пустой массив
         * @param {Object} ctx Технология ENB
         * @param {String} name Название опции
         * @returns {Array}
         */
        getArrayOption: function(name) {
            // todo@dima117a вынести в хелперы
            return [].concat(this.getOption(name, []));
        },
        parseEntity: function(entityString) {
            let entity = bemNaming.parse(entityString);
            let decl = { block: entity.block };

            entity.elem && (decl.elem = entity.elem);
            entity.modName && (decl.mod = entity.modName);
            entity.modVal && (decl.val = entity.modVal);

            return decl;
        }
    })
    .builder(function() {
        let entities = this.getArrayOption('entities').map(this.parseEntity);
        let json = JSON.stringify(entities, null, 4);

        return `exports.deps = ${json}`;
    })
    .createTech();
