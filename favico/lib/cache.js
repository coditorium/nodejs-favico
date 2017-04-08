const util = require('./util');
const jsdeep = require('jsdeep');

const logIfNot = (log, message) => (value) => {
  if (!value) log(message);
  return value;
};

const checkIfMasterPictureHasNotChanged = config =>
  Promise.all([
    util.hashFile(config.masterPicture),
    util.readFile(`${config.cache}/masterPicture.sha1`)
  ])
    .then(([hash1, hash2]) => hash1 === hash2)
    .then(logIfNot(config.log, 'Cache invalid. Master picture was modified.'))
    .catch((err) => {
      config.log('Cache invalid. Cause:', err);
      return false;
    });

const configsEqual = (a, b) => {
  const [ca, cb] = [a, b].map((c) => {
    const copy = Object.assign({}, c || {});
    delete copy.masterPicture;
    delete copy.output;
    delete copy.apiKey;
    delete copy.cache;
    delete copy.log;
    return copy;
  });
  return jsdeep.deepEqual(ca, cb);
};

const checkIfConfigIsNotChanged = config =>
  util.readJson(`${config.cache}/config.json`)
    .then(outputConfig => configsEqual(outputConfig, config))
    .then(logIfNot(config.log, 'Cache invalid. Configuration has changed.'))
    .catch((err) => {
      config.log('Cache invalid. Cause:', err);
      return false;
    });

const checkIfCacheExists = config =>
  util.dirExists(config.cache)
    .then(logIfNot(config.log, `Cache invalid. Cache directory does not exist '${config.cache}'`))
    .catch((err) => {
      config.log('Cache invalid. Cause:', err);
      return false;
    });

module.exports.copyFromCache = (config) => {
  config.log(`Using cached favicon '${config.cache}'`);
  return util.copyDir(config.cache, config.output)
    .then(() => util.readJson(`${config.output}/manifest.json`));
};

module.exports.copyToCache = (config, manifest) => {
  config.log('Caching favicons.');
  return util.copyDir(config.output, config.cache)
    .then(() => manifest);
};

module.exports.isCached = config =>
    checkIfCacheExists(config)
      .then(cached => cached && checkIfMasterPictureHasNotChanged(config))
      .then(cached => cached && checkIfConfigIsNotChanged(config));
