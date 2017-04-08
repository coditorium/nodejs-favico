#!/usr/bin/env node

const pkg = require('../package.json');
const generate = require('./generate');

const argv = require('yargs')
  .usage([
    `${pkg.name} v${pkg.version}`,
    `${pkg.description}`,
    '\nUsage:\n  $0 [options]'
  ].join('\n'))
  // .epilog(`for more information go to ${pkg.homepage}`)
  .help('help')
  .alias('help', 'h')
  .option('version', {
    description: 'Show version information',
    default: false,
    type: 'boolean'
  })
  .option('silent', {
    description: 'Suppress logs',
    default: false,
    type: 'boolean',
    alias: 's'
  })
  .option('config', {
    description: 'Specify configuration file from command line',
    default: './favicons.json',
    type: 'string',
    alias: 'c'
  })
  .option('output', {
    description: 'Specify output directory from command line. Overrides value from config file.',
    type: 'string',
    alias: 'o'
  })
  .option('cache', {
    description: 'Specify cache directory from command line. Overrides value from config file.',
    type: 'string'
  })
  .option('picture', {
    description: 'Specify master picture from command line. Overrides value from config file.',
    type: 'string'
  })
  .option('apikey', {
    description: 'Specify apikey from command line. Overrides value from config file.',
    type: 'string'
  })
  .argv;

if (argv.version) {
  console.log(`v${pkg.version}`); // eslint-disable-line
} else {
  generate(argv)
    .catch(err => console.log("Could not generate favicons.\n" + err));
}
