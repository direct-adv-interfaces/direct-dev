block('b1')(
    content()(function(){
        var count = this.ctx.count || 4;

        return [
            { elem: 'title' },
            { elem: 'description' },
            {
                elem: 'list',
                content: new Array(count).map(function(el, index) {
                    return { elem: 'item', content: 'item_' + index };
                })
            }
        ];
    })
);
