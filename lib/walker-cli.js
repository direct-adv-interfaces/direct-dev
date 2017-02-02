'use strict';

const cwd = process.cwd();
const path = require('path');
const program = require('commander');
const walker = require('./tools/walker');

// config
const config = require(path.resolve(cwd, '.direct-dev.js'));
const stringParam = val => typeof val === 'string' ? val : undefined;

// parse args
program
    .option('-p, --profile [value]', 'config profile name (optional)')
    .option('-b, --block [value]', 'target block name (optional)')
    .parse(process.argv);

// go!
walker(
    config,
    program.profile,
    stringParam(program.block));
