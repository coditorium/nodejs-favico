#!/usr/bin/env node

const pkg = require('../package.json');
const generate = require('./generate');

const argv = require('yargs')
  .usage([
    `${pkg.name} v${pkg.version}`,
    pkg.description,
    pkg.homepage,
    '\nUsage:\n  $0 [options]'
  ].join('\n'))
  .help('help')
  .alias('help', 'h')
  .option('version', {
    description: 'Show version',
    default: false,
    type: 'boolean',
    alias: 'v'
  })
  .option('silent', {
    description: 'Suppress logs',
    default: false,
    type: 'boolean',
    alias: 's'
  })
  .option('config', {
    description: 'Configuration file',
    default: './favicons.json',
    type: 'string',
    alias: 'c'
  })
  .option('output', {
    description: 'Output directory. Default: ./favicons',
    type: 'string',
    alias: 'o'
  })
  .option('cache', {
    description: 'Cache directory',
    type: 'string'
  })
  .option('picture', {
    description: 'Master picture. Default: ./favicon.png',
    type: 'string',
    alias: 'p'
  })
  .option('apikey', {
    description: 'RealFavicon API key',
    type: 'string',
    alias: 'a'
  })
  .argv;

if (argv.version || argv.v) {
  console.log(`v${pkg.version}`);
} else {
  generate(argv)
    .catch((err) => {
      console.log('Could not generate favicons');
      console.log(err);
    });
}
