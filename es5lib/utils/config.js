'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lodash = require('lodash');

/**
 * Конфиг с поддержкой профилей
 */

var Config =

/**
 * Формирует объект с данными объекта config, расширенный данными
 * объекта config.profile[profileName], если указан параметр profileName
 * @param {Object} config - Объект с данными
 * @param {String} [profileName] - Название профиля
 */
function Config(config, profileName) {
  _classCallCheck(this, Config);

  var profile = profileName && (config.profiles || {})[profileName];
  var sources = [this, config].concat(profile || []);

  lodash.merge.apply(lodash, _toConsumableArray(sources));
};

module.exports = Config;