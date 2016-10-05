block('dev-page').mod('type', 'examples')(

    elem('title').content()('examples'),

    elem('body').content()(function() {
        return 'xxx-xxx-xxxx-xx';
    })
);
