const rfgApi = require('rfg-api');
const util = require('./util');
const { deepCopy } = require('jsdeep');

const createRequest = (rfg, config) => rfg.createRequest({
  apiKey: config.apiKey,
  masterPicture: config.masterPicture,
  iconsPath: config.iconsPath,
  design: config.design,
  settings: config.settings,
  versioning: config.versioning
});

const extractMetaConfig = config => ({
  iconsPath: config.iconsPath,
  design: config.design,
  settings: config.settings,
  versioning: config.versioning
});

const writeMetaFile = (config, meta) =>
  util.hashFile(config.masterPicture)
    .then(hash => Object.assign({
      masterPictureHash: hash,
      masterPicture: config.masterPicture,
      config: extractMetaConfig(config),
      timestamp: new Date().getTime()
    }, meta))
    .then(result =>
      util.writeJsonFile(result, `${config.output}/meta.json`)
        .then(() => result)
    );

const writeFaviconsHtml = (config, meta) =>
  util.writeFile(meta.favicon.html_code, `${config.output}/favicons.html`);

const sendRequest = config =>
  util.toPromise((cb) => {
    const rfg = rfgApi.init();
    const request = createRequest(rfg, deepCopy(config));
    config.log('Sending request to https://realfavicongenerator.net/. This takes ~25 seconds.');
    rfg.generateFavicon(request, config.output, cb);
  });

const generateFavicon = config =>
  util.ensureDirector(config.output)
    .then(() => sendRequest(config))
    .then(data => writeMetaFile(config, data))
    .then(meta => writeFaviconsHtml(config, meta));

module.exports = generateFavicon;
