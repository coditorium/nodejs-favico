const resolveConfig = require('../lib/config');

const buildConfig = custom => Object.assign({
  masterPicture: 'picture.png',
  output: './output'
}, custom);

unitTest('resolveConfig:', () => {
  it('should add default config values', () => {
    const config = resolveConfig(buildConfig({}));
    expect(config).to.have.keys([
      'apiKey',
      'log',
      'design',
      'settings',
      'iconsPath',
      'masterPicture',
      'output',
      'reuseOutput'
    ]);
  });

  it('should setup application name in multiple properties', () => {
    const appName = 'app';
    const config = resolveConfig(buildConfig({ appName }));
    expect(config.design.ios.appName).to.be.equal(appName);
    expect(config.design.androidChrome.manifest.name).to.be.equal(appName);
  });
});
