/**
 * sandbox
 * ===
 *
 * Собирает бандл для песочницы. Включает туда содержимое файлов .sandbox.js, обернутое
 * в служебный код песочницы.
 *
 * **Опции**
 *
 * * *String* [target] — Результирующий таргет. По умолчанию `?.sandbox.js`.
 *
 * **Пример**
 *
 * ```javascript
 *
 *  var techs = require('direct-dev').techs;
 *
 *  nodeConfig.addTech(techs.devPageBemjson, { target: '?.sandbox.js' });
 * ```
 */

var util = require('util'),
    vow = require('vow'),
    vowFs = require('vow-fs');

module.exports = require('enb/lib/build-flow').create()
    .name('sandbox')
    .target('target', '?.sandbox.js')
    .useFileList('sandbox.js')
    .builder(function(paths) {
        var node = this.node;

        return vow.all(paths.map(function(file) {

            return vowFs.read(file.fullname, 'utf8').then(function(data) {

                var filename = node.relativePath(file.fullname),
                    src =  util.format('(function(window) {' +
                        'var module = { exports: {} }, exports = module.exports; %s;' +
                        '!window.SANDBOX && (window.SANDBOX = {});' +
                        '!window.SANDBOX.blocks && (window.SANDBOX.blocks = []);' +
                        'window.SANDBOX.blocks.push(module.exports);' +
                    '})(window);', data);

                return '/* begin: ' + filename + ' *' + '/\n' + src + '\n/* end: ' + filename + ' *' + '/';
            });
        })).then(function(contents) {
            return contents.join('\n');
        });
    })
    .createTech();



