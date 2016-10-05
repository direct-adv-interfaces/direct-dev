block('dev-page').mod('type', 'test')(

    elem('title').content()('tests'),

    elem('body').content()(function() {
        return 'test page';
    })
);
