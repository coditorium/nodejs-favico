const util = require('./util');
const jsdeep = require('jsdeep');

const logIfNot = (log, message) => (value) => {
  if (!value) log(message);
  return value;
};

const checkIfMasterPictureHasNotChanged = (dirPath, config) =>
  Promise.all([
    util.hashFile(config.masterPicture),
    util.readJson(`${dirPath}/meta.json`)
  ])
    .then(([hash1, meta]) => hash1 === meta.masterPictureHash)
    .then(logIfNot(config.log, `Directory ${dirPath} invalidated. Master picture was modified.`));

const configsEqual = (a, b) => {
  const [ca, cb] = [a, b].map((c) => {
    const copy = Object.assign({}, c || {});
    delete copy.masterPicture;
    delete copy.reuseOutput;
    delete copy.output;
    delete copy.apiKey;
    delete copy.cache;
    delete copy.log;
    return copy;
  });
  return jsdeep.deepEqual(ca, cb);
};

const checkIfConfigIsNotChanged = (dirPath, config) =>
  util.readJson(`${dirPath}/meta.json`)
    .then(meta => configsEqual(meta.config, config))
    .then(logIfNot(config.log, `Configuration changed. Directory ${dirPath} invalidated.`));

const checkIfDirExists = (dirPath, config) =>
  util.dirExists(dirPath)
    .then(logIfNot(config.log, `Directory does not exist '${dirPath}'`));

const isChanged = (dirPath, config) =>
  checkIfDirExists(dirPath, config)
    .then(cached => cached && checkIfMasterPictureHasNotChanged(dirPath, config))
    .then(cached => cached && checkIfConfigIsNotChanged(dirPath, config))
    .catch((err) => {
      config.log(`Directory ${dirPath} invalidated. Cause:`, err);
      return false;
    });

module.exports.isCacheUpToDate = config => (
  config.cache ?
    isChanged(config.cache, config) :
    Promise.resolve(false)
);

module.exports.isOutputUpToDate = config => (
  config.reuseOutput ?
    isChanged(config.output, config) :
    Promise.resolve(false)
);
