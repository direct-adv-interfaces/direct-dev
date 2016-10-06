block('dev-page')(

    elem('head').tag()('head'),
    elem('body').tag()('body'),
    elem('title').tag()('title'),
    elem('meta').tag()('meta'),
    elem('script').def()(function() {
        return '<script>' + (this.ctx.script || '') + '</script>';
    }),

    elem('css')(
        tag()('link'),
        attrs()(function() {
            return {
                rel: 'stylesheet',
                href: this.ctx.url
            };
        })
    ),

    elem('js')(
        tag()('script'),
        attrs()(function() {
            return { src: this.ctx.url };
        })
    ),

    tag()('html'),
    content()(function() {
        var refs = this.ctx.refs || {};

        return [
            {
                elem: 'head',
                content: [
                    { elem: 'title' },
                    { elem: 'meta', attrs: { charset: 'utf-8' } },
                    refs.css && { elem: 'css', url: refs.css }
                ]
            },
            { elem: 'body', refs: refs }
        ];
    })
);
