const techUtils = require('../../lib/utils');
const gulpIf = require('gulp-if');

module.exports = function(targetLevels, targetBlock, rootPath, streamThen, streamElse) {

    let filter = techUtils.createFilter(
        {
            targetLevels: targetLevels.map(techUtils.normalizeLevel.bind(this, rootPath)),
            targetBlock: targetBlock
        }, file => file.path);

    return gulpIf(filter, streamThen, streamElse);
};
