/**
 * dev-page-bemjson
 * ===
 *
 * Генерирует bemjson.js с блоком `dev-page`.
 *
 * **Опции**
 *
 * * *String* [target] — Результирующий таргет. По умолчанию `?.bemjson.js`.
 * * *String* [block] — Название корневого блока.
 * * *String* [type] — Значение модификатора `type`.
 * * *String* [js] — js-таргет для подключения к странице.
 * * *String* [devJs] — js-таргет для подключения к странице вспомогательного кода (например, тестов).
 * * *String* [css] — css-таргет для подключения к странице.
 *
 * **Пример**
 *
 * ```javascript
 *
 *  var techs = require('direct-dev').techs;
 *
 *  nodeConfig.addTech(techs.devPageBemjson, {
 *      target: '?.bemjson.js',
 *      type: 'test',
 *      js: '?.js',
 *      devJs: '?.test.js',
 *      css: '?.css'
 *  });
 * ```
 */

/**
 * @type {Tech}
 */
module.exports = require('enb/lib/build-flow').create()
    .name('dev-page-bemjson')
    .target('target', '?.bemjson.js')
    .defineOption('block', 'dev-page')
    .defineOption('type')
    .defineOption('js')
    .defineOption('devJs')
    .defineOption('css')
    .builder(function() {
        var resolveFilename = (function(target) {
                return this.unmaskNodeTargetName(this.getPath(), target);
            }).bind(this.node),
            bemjson = {
                block: this._block,
                refs: {
                    js: this._js && resolveFilename(this._js),
                    devJs: this._devJs && resolveFilename(this._devJs),
                    css: this._css &&resolveFilename(this._css)
                }
            };

        this._type && (bemjson.mods = { type: this._type });

        return '(' + JSON.stringify(bemjson, null, 4) + ')';
    })
    .createTech();
