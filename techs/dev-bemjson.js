/**
 * dev-bemjson
 * ===
 *
 * Генерирует bemjson.js для заданных блоков.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `?.bemjson.js`.
 * * *String* **bemjson** — Блоки, которые нужно поместить в сгенерированный файл.
 *
 * **Пример**
 *
 * ```javascript
 *
 *  var techs = require('direct-dev').techs;
 *
 *  nodeConfig.addTech(techs.devBemjson, {
 *      target: '?.bemjson.js',
 *      bemjson: { block: 'xxx' }
 *  });
 * ```
 */

/**
 * @type {Tech}
 */
module.exports = require('enb/lib/build-flow').create()
    .name('dev-bemjson')
    .target('target', '?.bemjson.js')
    .defineRequiredOption('bemjson')
    .builder(function() {

        return '(' + JSON.stringify(this._bemjson) + ')';
    })
    .createTech();
