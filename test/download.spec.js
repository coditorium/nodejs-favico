const favico = require('../lib');
const fs = require('./fsUtil');

const config = {
  masterPicture: './test/favicon.png',
  output: './test/build',
  cache: './test/cache',
  reuseOutput: true,
  log: console.log
};

const buildConfig = custom => Object.assign({
  masterPicture: './test/favicon.png',
  output: './test/build',
  cache: './test/cache',
  log: console.log
}, custom);

acceptTest('favico:', () => {
  before(() => favico(config));
  after(() => fs.delete(config.output));
  after(() => fs.delete(config.cache));

  it('should generate favicons with config files', () =>
    expect(fs.fileExists(
        `${config.output}/manifest.json`,
        `${config.output}/meta.json`,
        `${config.output}/favicons.html`,
        `${config.output}/favicon.ico`,
        `${config.output}/favicon-16x16.png`
      )).to.eventually.be.true
  );

  it('should cache directory', () =>
    expect(fs.dirExists(config.cache)).to.eventually.be.true
  );

  it('should generate trimp apiKey from meta.json', () =>
    expect(
      fs.readJson(`${config.output}/meta.json`)
        .then(c => c.hasOwnProperty('apiKey') || c.config.hasOwnProperty('apiKey'))
    ).to.eventually.be.false
  );

  it('should not download favicons if output is up to date', () =>
    expect(
      fs.readFile(`${config.output}/meta.json`)
        .then(meta => meta.timestamp)
        .then(timestamp =>
          favico(config)
            .then(() => fs.readFile(`${config.output}/meta.json`))
            .then(meta => meta.timestamp)
            .then(timestamp2 => timestamp === timestamp2)
        )
    ).to.eventually.be.true
  );

  it('should not download favicons if cache is valid', () =>
    expect(
      fs.readFile(`${config.output}/meta.json`)
        .then(meta => meta.timestamp)
        .then(timestamp =>
          favico(buildConfig({ reuseOutput: false }))
            .then(() => fs.readFile(`${config.output}/meta.json`))
            .then(meta => meta.timestamp)
            .then(timestamp2 => timestamp === timestamp2)
        )
    ).to.eventually.be.true
  );
});
