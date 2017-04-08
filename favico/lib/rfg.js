const rfgApi = require('rfg-api');
const util = require('./util');
const jsdeep = require('jsdeep');
const path = require('path');

const createRequest = (rfg, config) => rfg.createRequest({
  apiKey: config.apiKey,
  masterPicture: config.masterPicture,
  iconsPath: config.iconsPath,
  design: config.design,
  settings: config.settings,
  versioning: config.versioning
});

const writeConfigFile = (config) => {
  const copy = Object.assign({}, config);
  delete copy.apiKey;
  return util.writeJsonFile(copy, path.join(config.output, 'config.json'));
};

const writeMasterPictureHashFile = (config) => {
  const { masterPicture } = config;
  const hashFile = path.join(config.output, 'masterPicture.sha1');
  return util.hashFile(masterPicture)
    .then(hash => util.writeFile(hash, hashFile));
};

const writeDownloadTimestamp = (config) => {
  const tsFile = path.join(config.output, 'download.ts');
  return util.writeFile(new Date().getTime(), tsFile);
};

const writeMarkupFile = (output, markup) =>
  util.writeJsonFile(markup, path.join(output, 'markup.json'));

const generateFavicon = config =>
  util.toPromise((cb) => {
    const rfg = rfgApi.init();
    const request = createRequest(rfg, jsdeep.deepCopy(config));
    config.log('Sending request to https://realfavicongenerator.net/. This takes ~25 seconds.');
    rfg.generateFavicon(request, config.output, cb);
  })
    .then(data => writeMarkupFile(config.output, data))
    .then(() => writeConfigFile(config))
    .then(() => writeMasterPictureHashFile(config))
    .then(() => writeDownloadTimestamp(config));

module.exports = generateFavicon;
