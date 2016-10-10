block('dev-page').mod('type', 'sandbox')(

    elem('title').content()('sandbox'),

    elem('body').content()(function() {
        var refs = this.ctx.refs;

        return [
            // Контейнер для блоков
            { elem: 'sandbox-container', attrs: { id: 'sandbox-container' } },

            refs.js && { elem: 'js', url: refs.js },
            refs.devJs && { elem: 'js', url: refs.devJs },
            { elem: 'script', script: 'window.SANDBOX && window.SANDBOX.init();' }
        ];
    })
);
