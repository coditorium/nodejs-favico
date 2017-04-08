const resolveConfig = require('./config');
const sendRfgRequest = require('./rfg');
const util = require('./util');
const cache = require('./cache');

const copyIfCached = (config, generate) => (
  !config.cache ?
    generate() :
    cache.isCached(config)
      .then(cached => (cached ?
          cache.copyFromCache(config) :
          generate().then(manifest => cache.copyToCache(config, manifest))
      ))
);

const generateFaviconsIfNotCached = config =>
  copyIfCached(config, () => sendRfgRequest(config));

const generateFavicons = (config) => {
  const resolved = resolveConfig(config);
  return util.ensureDirector(resolved.output)
    .then(() => generateFaviconsIfNotCached(resolved));
};

module.exports = generateFavicons;
