#!/usr/bin/env node

const favico = require('favico');
const util = require('./util');

const defaultConfig = {
  log: true,
  output: './favicons',
  picture: './favicon.png'
};

const mergeConfigWithArgs = (config, argv) => {
  const resolved = Object.assign({}, defaultConfig, config, argv);
  if (resolved.silent === true) {
    resolved.log = false;
  }
  return resolved;
};

const generateFavicons = argv =>
  util.readJson(argv.config)
    .then(config => mergeConfigWithArgs(config, argv))
    .then(config => favico(config));

module.export = generateFavicons;
