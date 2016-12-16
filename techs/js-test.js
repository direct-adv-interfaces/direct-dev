'use strict';

const _ = require('lodash');
const vow = require('vow');
const vowFs = require('vow-fs');
const path = require('path');
const bemNaming = require('bem-naming');
const pathIsInside = require('path-is-inside');

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
         * @param {Object} ctx Технология ENB
         * @param {String} name Название опции
         * @returns {Array}
         */
        getArrayOption: function(name) {
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
         * Проверяет, соответствует ли файл заданным фильтрам
         * @param {String} fileInfo Полный путь к файлу
         * @returns {boolean}
         */
        applyFilter: function(fileInfo) {
            const targetLevels = this.filter.targetLevels;

            if (this.filter.targetBlock) {
                let baseName = path.basename(fileInfo.fullname).split('.')[0];
                let entity = bemNaming.parse(baseName);

                if (entity.block !== this.filter.targetBlock) {
                    return false;
                }
            }

            if (targetLevels.length && !_.some(targetLevels, pathIsInside.bind(this, fileInfo.fullname))) {
                return false;
            }

            return true;
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
            .filter(file => this.applyFilter(file))
            .map(file => this.getContent(file))
        ).then(files => files.join('\n'));
    })
    .createTech();
