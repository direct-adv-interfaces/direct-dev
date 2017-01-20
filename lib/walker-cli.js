'use strict';

const cwd = process.cwd();
const path = require('path');
const program = require('commander');
const walker = require('./tools/walker');

// config
const config = require(path.resolve(cwd, '.direct-dev.js'));

// parse args
program
    .option('-p, --profile [profile]', 'config profile name (optional)')
    .parse(process.argv);

// go!
walker(config, program.profile);
