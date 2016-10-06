block('dev-page').mod('type', 'test')(

    // Содержимое тэга TITLE
    elem('title').content()('tests'),

    elem('body').content()(function() {
        var refs = this.ctx.refs;

        return [
            // Контейнер, в который mocha выводит результаты в браузере
            { elem: 'test-runner', attrs: { id: 'mocha' } },

            // Контейнер для тестовых блоков
            { elem: 'test-container', attrs: { id: 'test-container' } },

            refs.js && { elem: 'js', url: refs.js },
            { elem: 'script', script: 'window.BEM && BEM.DOM && BEM.DOM.init && BEM.DOM.init();' },
            refs.devJs && { elem: 'js', url: refs.devJs },
            { elem: 'script', script: 'window.mochaPhantomJS ? window.mochaPhantomJS.run() : window.mocha.run();' }
        ];
    })
);
