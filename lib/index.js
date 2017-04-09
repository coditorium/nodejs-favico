const resolveConfig = require('./config');
const sendRfgRequest = require('./rfg');
const useCacheOrGenerate = require('./cache');
const reuseOutput = require('./output');

const generateFavicons = (config) => {
  const resolved = resolveConfig(config);
  return reuseOutput(resolved)
    .then(manifest => manifest || useCacheOrGenerate(resolved, sendRfgRequest));
};

module.exports = generateFavicons;
