const favico = require('../lib');
const fs = require('./fsUtil');

const config = {
  masterPicture: './test/favicon.png',
  output: './test/build',
  cache: './test/cache',
  log: console.log
};

acceptTest('favico:', () => {
  before(() => favico(config));
  after(() => fs.delete(config.output));
  after(() => fs.delete(config.cache));

  it('should generate favicons with config files', () =>
    expect(fs.fileExists(
        `${config.output}/config.json`,
        `${config.output}/masterPicture.sha1`,
        `${config.output}/download.ts`,
        `${config.output}/manifest.json`,
        `${config.output}/markup.json`,
        `${config.output}/favicon.ico`,
        `${config.output}/favicon-16x16.png`
      )).to.eventually.be.true
  );

  it('should cache directory', () =>
    expect(fs.dirExists(config.cache)).to.eventually.be.true
  );

  it('should generate config.json without apiKey', () =>
    expect(
      fs.readJson(`${config.output}/config.json`)
        .then(c => c.hasOwnProperty('apiKey'))
    ).to.eventually.be.false
  );

  it('should not download favicons if cache is valid', () =>
    expect(
      fs.readFile(`${config.output}/download.ts`)
        .then(timestamp =>
          favico(config)
            .then(() => fs.readFile(`${config.output}/download.ts`))
            .then(timestamp2 => timestamp === timestamp2)
        )
    ).to.eventually.be.true
  );
});
