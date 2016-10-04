module.exports = {

    /**
     * Возвращает функцию, определяющую название файла по названию таргета
     * @param {Object} node - нода enb
     * @returns {Function}
     */
    getFilenameResolver: function(node) {
        return (function(target) {
            return this.unmaskNodeTargetName(this.getPath(), target);
        }).bind(node);
    },

    /**
     * Проверяет, является ли переданное значение непустым массивом
     * @param {*} obj - проверяемое значение
     * @returns {boolean}
     */
    isArray: function(obj) {
        return Array.isArray(obj) && !!obj.length;
    }
};
