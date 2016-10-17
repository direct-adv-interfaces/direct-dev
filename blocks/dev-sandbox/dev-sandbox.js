(function(window){
    var initFn = function(obj, container) {
            obj && (typeof obj.init === 'function') && obj.init(container);
        };

    !window.SANDBOX && (window.SANDBOX = {});

    window.SANDBOX.init = function(container) {
        window.SANDBOX.blocks && window.SANDBOX.blocks.forEach(function(obj){
            initFn(obj, container);
        }, this);
    };

    window.SANDBOX.addInitializer = function(fn){
        var prevInitFn = initFn;

        initFn = function(obj, container) {
            (typeof fn === 'function') && fn(obj, container);
            prevInitFn(obj, container);
        }
    };
})(window);
