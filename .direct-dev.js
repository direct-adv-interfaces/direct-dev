module.exports = {
    levels: [
        'example-project/common.blocks',
        'example-project/desktop.blocks'
    ],
    profiles: {
        'generate-test-bundles': {
            handler: './walker-plugins/test-reporter-console'
        }
    }
};
