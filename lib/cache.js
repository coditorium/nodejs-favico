const { copyDir } = require('./util');
const { isCacheUpToDate } = require('./changed');

const copyFromCache = (config) => {
  config.log(`Using cached favicon '${config.cache}'`);
  return copyDir(config.cache, config.output);
};

const copyToCache = (config) => {
  config.log(`Caching favicons in ${config.cache}`);
  return copyDir(config.output, config.cache);
};

const useCacheOrGenerate = (config, generate) =>
  isCacheUpToDate(config)
    .then(cached => (
        cached ?
          copyFromCache(config) :
          generate(config).then(() => copyToCache(config)
    )));

module.exports = useCacheOrGenerate;
