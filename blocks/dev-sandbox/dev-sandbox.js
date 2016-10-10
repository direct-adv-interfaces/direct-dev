(function(window){
    var initFn = function(obj) {
            obj && (typeof obj.init === 'function') && obj.init();
        };

    !window.SANDBOX && (window.SANDBOX = {});

    window.SANDBOX.init = function() {
        window.SANDBOX.blocks && window.SANDBOX.blocks.forEach(initFn, this);
    };

    window.SANDBOX.addInitializer = function(fn){
        var prevInitFn = initFn;

        initFn = function(obj) {
            (typeof fn === 'function') && fn(obj);
            prevInitFn(obj);
        }
    };
})(window);
