module.exports = {
    levels: [
        'example-project/common.blocks',
        'example-project/desktop.blocks'
    ],
    profiles: {
        'test-bundles': {
            handler: './walker-plugins/test-bundler'
        },
        'test-report': {
            handler: './walker-plugins/test-reporter',
            handlerConfig: {
                reporter: 'console'
            },
            levels: ['example-project/desktop.bundles']
        },
        'test-report-teamcity': {
            handler: './walker-plugins/test-reporter',
            handlerConfig: {
                reporter: 'teamcity'
            },
            levels: ['example-project/desktop.bundles']
        }
    }
};
