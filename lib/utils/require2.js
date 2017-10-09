'use strict';

module.exports = function() {
    for (let i = 0; i < arguments.length - 1; i++)
    {
        try {
            return require(arguments[i]);
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
    }

    return require(arguments[arguments.length - 1]);
};
