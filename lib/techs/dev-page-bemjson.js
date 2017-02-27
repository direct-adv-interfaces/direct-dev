'use strict';

/** [dev-page-bemjson](https://github.com/direct-adv-interfaces/direct-dev/TECHS.md#dev-page-bemjson) */

module.exports = require('enb/lib/build-flow').create()
    .name('dev-page-bemjson')
    .target('target', '?.bemjson.js')
    .defineOption('block', 'dev-page')
    .defineOption('type')
    .dependOn('js')
    .dependOn('devJs')
    .dependOn('css')
    .builder(function() {
        var resolveFilename = (function(target) {
                return this.unmaskNodeTargetName(this.getPath(), target);
            }).bind(this.node),
            bemjson = {
                block: this._block,
                refs: {
                    js: this._js && resolveFilename(this._js),
                    devJs: this._devJs && resolveFilename(this._devJs),
                    css: this._css && resolveFilename(this._css)
                }
            };

        this._type && (bemjson.mods = { type: this._type });

        return '(' + JSON.stringify(bemjson, null, 4) + ')';
    })
    .createTech();
