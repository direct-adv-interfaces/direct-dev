'use strict';

const lodash = require('lodash');

/**
 * Конфиг с поддержкой профилей
 */
class Config {

    /**
     * Формирует объект с данными объекта config, расширенный данными
     * объекта config.profile[profileName], если указан параметр profileName
     * @param {Object} config - Объект с данными
     * @param {String} [profileName] - Название профиля
     */
    constructor (config, profileName) {
        let profile = profileName && (config.profiles || {})[profileName];
        let sources = [this, config].concat(profile || []);

        lodash.merge.apply(lodash, sources);
    }
}

module.exports = Config;
