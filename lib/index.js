const resolveConfig = require('./config');
const sendRfgRequest = require('./rfg');
const useCacheOrGenerate = require('./cache');
const reuseOutput = require('./output');

const generateFavicons = (config) => {
  const resolved = resolveConfig(config);
  return reuseOutput(resolved)
    .then((reuse) => {
      if (reuse) return reuse;
      return resolved.cache ?
        useCacheOrGenerate(resolved, sendRfgRequest) :
        sendRfgRequest(resolved);
    });
};

module.exports = generateFavicons;
