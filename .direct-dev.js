module.exports = {
    levels: [
        'example-project/common.blocks',
        'example-project/desktop.blocks'
    ],
    exclude: ['b1', 'b3__el4'],
    profiles: {
        'test-bundles': {
            handler: './walker-plugins/test-bundler',
            handlerConfig: {
                resultPath: 'example-project/bundles.json',
                baseBundlePath: 'example-project/desktop.bundles',
                devEntities: ['dev-page', 'dev-page_type_test'],
                defaultBundleConfig: {
                    target: '?.test-result.json'
                }
            }
        },
        'gemini-bundles': {
            handler: './walker-plugins/gemini-bundler',
            handlerConfig: {
                resultPath: 'example-project/bundles.json',
                baseBundlePath: 'example-project/desktop.bundles',
                devEntities: ['dev-page', 'dev-page_type_test'],
                defaultBundleConfig: {
                }
            }
        },
        'test-report': {
            handler: './walker-plugins/test-reporter',
            handlerConfig: {
                reporter: 'console',
                displayEmpty: true,
                throwError: true
            },
            levels: ['example-project/desktop.bundles']
        },
        'test-report-teamcity': {
            handler: './walker-plugins/test-reporter',
            handlerConfig: {
                reporter: 'teamcity'
            },
            levels: ['example-project/desktop.bundles']
        },
        'coverage-report': {
            handler: './walker-plugins/coverage-reporter',
            handlerConfig: {
                reporter: 'html',
                dir: 'mimimi'
            },
            levels: ['example-project/desktop.bundles']
        }
    }
};
