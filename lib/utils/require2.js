module.exports = function() {
    for (let i = 0; i < arguments.length - 1; i++)
    {
        try {
            return require(arguments[i]);
        } catch (e) {
            console.error(e.message);
        }
    }

    return require(arguments[arguments.length - 1]);
};
