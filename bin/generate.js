const favico = require('../lib');
const util = require('../lib/util');

const defaultConfig = {
  log: true,
  output: './favicons',
  masterPicture: './favicon.png'
};

const mergeConfigWithArgs = (config, argv) => {
  const resolved = Object.assign({}, defaultConfig, config);
  if (argv.silent) resolved.log = false;
  if (argv.picture) resolved.masterPicture = argv.picture;
  if (argv.output) resolved.output = argv.output;
  if (argv.cache) resolved.cache = argv.cache;
  if (argv.reuse) resolved.reuseOutput = argv.reuse;
  if (argv.apikey) resolved.apiKey = argv.apikey;
  return resolved;
};

const generateFavicons = argv =>
  util.readJsonIfExists(argv.config)
    .then(config => mergeConfigWithArgs(config, argv))
    .then(config => favico(config));

module.exports = generateFavicons;
