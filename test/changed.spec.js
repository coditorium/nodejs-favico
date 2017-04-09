const { isCacheUpToDate } = require('../lib/changed');

const config = (custom = {}) => Object.assign({
  cache: './test/cacheSamples',
  masterPicture: './test/cacheSamples/unmodified.png',
  appName: 'app',
  log: console.log
}, custom);

const isCached = customConfig =>
  isCacheUpToDate(config(customConfig));

unitTest('changed', () => {
  describe('isCacheUpToDate:', () => {
    it('should return false on no cache directory', () =>
      expect(isCached({ cache: './test/cacheSamples/nocache' }))
        .to.be.eventually.false);

    it('should return false on modified master picture', () =>
      expect(isCached({
        masterPicture: './test/cacheSamples/modified.png'
      })).to.be.eventually.false);

    it('should return false on changed config', () =>
      expect(isCached({
        masterPicture: './test/cacheSamples/unmodified.png',
        appName: 'app2'
      })).to.be.eventually.false);

    it('should return true on cached favicons', () =>
      expect(isCached()).to.be.eventually.true);
  });
});
