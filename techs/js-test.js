'use strict';

const vow = require('vow');
const vowFs = require('vow-fs');
const path = require('path');
const techUtils = require('../lib/utils');

module.exports = require('enb/lib/build-flow').create()
    .name('js-test')
    .target('target', '?.test.js')
    .defineOption('targetLevels')
    .defineOption('targetBlock')
    .useFileList('test.js')
    .needRebuild(function(){ return true; })
    .methods({
        /**
         * Возвращает массив значений для заданной опции технологии
         * - если значение - не массив, создает массив из одного элемента
         * - если значение не задано, возвращает пустой массив
         * @param {String} name Название опции
         * @returns {Array}
         */
        getArrayOption: function(name) {
            // todo@dima117a вынести в хелперы
            return [].concat(this.getOption(name, []));
        },

        /**
         * Возвращает полный путь к папке уровня
         * @param {String|Object} level Информация об уровне переопределения
         * @returns {String}
         */
        normalizeLevel: function(level) {
            typeof level === 'string' && (level = { path: level });
            return path.resolve(this.node.getRootDir(), level.path);
        },

        /**
         * Читает файл с диска и формирует для него контент, который нужно добавить в бандл
         * @param {String} fileInfo обрабатываемый файл
         * @returns {Promise.<String>}
         */
        getContent: function(fileInfo) {
            let filename = this.node.relativePath(fileInfo.fullname);

            return vowFs.read(fileInfo.fullname, 'utf8').then(function(data) {
                return `/* begin: ${filename} */\n${data};\n/* end: ${filename} */`;
            });
        }
    })
    .prepare(function() {
        this.filter = {
            targetBlock: this.getOption('targetBlock', undefined),
            targetLevels: this.getArrayOption('targetLevels')
                .map(level => this.normalizeLevel(level))
        };
    })
    .builder(function(paths) {
        return vow.all(paths
            .filter(techUtils.createFilter(this.filter, file => file.fullname))
            .map(file => this.getContent(file))
        ).then(files => files.join('\n'));
    })
    .createTech();
