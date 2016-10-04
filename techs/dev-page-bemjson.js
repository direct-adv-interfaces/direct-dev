/**
 * dev-page-bemjson
 * ===
 *
 * Генерирует bemjson.js с блоком `dev-page`.
 *
 * **Опции**
 *
 * * *String* [target] — Результирующий таргет. По умолчанию `?.bemjson.js`.
 * * *String* [type] — Значение модификатора `type`.
 * * *String[]* [js] — Список js-таргетов для подключения к странице.
 * * *String[]* [css] — Список css-таргетов для подключения к странице.
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
 *      js: ['?.js', '?.test.js'],
 *      css: ['?.css']
 *  });
 * ```
 */

var helpers = require('../lib/helpers');

/**
 * @type {Tech}
 */
module.exports = require('enb/lib/build-flow').create()
    .name('dev-page-bemjson')
    .target('target', '?.bemjson.js')
    .defineOption('type')
    .defineOption('js')
    .defineOption('css')
    .builder(function() {
        var resolveFilename = helpers.getFilenameResolver(this.node),
            bemjson = { block: 'dev-page' },
            jsFiles = this._js,
            cssFiles = this._css;

        this._type && (bemjson.mods = { type: this._type });

        helpers.isArray(jsFiles) && (bemjson.js = jsFiles.map(resolveFilename));
        helpers.isArray(cssFiles) && (bemjson.css = cssFiles.map(resolveFilename));

        return '(' + JSON.stringify(bemjson) + ')';
    })
    .createTech();
