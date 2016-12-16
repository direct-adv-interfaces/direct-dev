'use strict';

const _ = require('lodash');
const vow = require('vow');
const vowFs = require('vow-fs');
const path = require('path');
const bemNaming = require('bem-naming');
const pathIsInside = require('path-is-inside');

/**
 * Преобразует массив уровней
 * @param {String|Object} level Информация об уровне переопределения
 * @returns {String} Возвращает полный путь к папке уровня
 */
function normalizeLevel(level) {
    typeof level === 'string' && (level = { path: level });
    return path.resolve(this.getRootDir(), level.path);
}

/**
 * Проверяет, соответствует ли файл заданным фильтрам
 * @param {String} file Полный путь к файлу
 * @returns {boolean}
 */
function applyFilter(file) {
    const filePath = file.fullname;
    const targetLevels = this.filter.targetLevels;

    if (this.filter.targetBlock) {
        let baseName = path.basename(filePath).split('.')[0];
        let entity = bemNaming.parse(baseName);

        if (entity.block !== this.filter.targetBlock) {
            return false;
        }
    }

    if (targetLevels.length && !_.some(targetLevels, pathIsInside.bind(this, filePath))) {
        return false;
    }

    return true;
}

function getContent(file) {
    let filename = this.node.relativePath(file.fullname);

    return vowFs.read(file.fullname, 'utf8').then(function(data) {
        return `/* begin: ${filename} */\n${data};\n/* end: ${filename} */`;
    });
}

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
        }
    })
    .prepare(function() {
        this.filter = {
            targetBlock: this.getOption('targetBlock', undefined),
            targetLevels: this.getArrayOption('targetLevels')
                .map(normalizeLevel.bind(this.node))
        };
    })
    .builder(function(paths) {
        return vow.all(paths
            .filter(applyFilter.bind(this))
            .map(getContent.bind(this))
        ).then(files => files.join('\n'));
    })
    .createTech();
