const resolveConfig = require('../lib/config');

unitTest('resolveConfig:', () => {
  it('should add default config values', () => {
    const config = resolveConfig({});
    expect(config).to.have.keys(['apiKey', 'log', 'design', 'settings', 'iconsPath']);
  });

  it('should setup application name in multiple properties', () => {
    const appName = 'app';
    const config = resolveConfig({ appName });
    expect(config.design.ios.appName).to.be.equal(appName);
    expect(config.design.androidChrome.manifest.name).to.be.equal(appName);
  });
});
