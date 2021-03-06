const jsdeep = require('jsdeep');

const nolog = () => {};

const defaultConfig = {
  apiKey: 'eabf77c98d6bd1eea81fb58be7895c42dafc2b21',
  iconsPath: '/',
  log: nolog,
  reuseOutput: true,
  design: {
    ios: {
      pictureAspect: 'backgroundAndMargin',
      backgroundColor: '#ffffff',
      margin: '14%'
    },
    desktopBrowser: {},
    windows: {
      pictureAspect: 'noChange',
      backgroundColor: '#da532c',
      onConflict: 'override'
    },
    androidChrome: {
      pictureAspect: 'shadow',
      themeColor: '#b5b5b5',
      manifest: {
        display: 'browser',
        orientation: 'notSet',
        onConflict: 'override',
        declared: true
      }
    },
    safariPinnedTab: {
      pictureAspect: 'silhouette',
      themeColor: '#5bbad5'
    }
  },
  settings: {
    scalingAlgorithm: 'Mitchell',
    errorOnImageTooSmall: false
  }
};

const resolveDynamicValues = (config) => {
  let dynamic = {};
  if (config.appName) {
    dynamic = jsdeep.deepSet(dynamic, 'design.ios.appName', config.appName);
    dynamic = jsdeep.deepSet(dynamic, 'design.androidChrome.manifest.name', config.appName);
  }
  if (config.log === true) {
    dynamic.log = console.log; // eslint-disable-line
  } else if (config.log === false) {
    dynamic.log = nolog;
  }
  return dynamic;
};

const validateConfig = (config) => {
  if (!config.masterPicture || typeof config.masterPicture !== 'string') {
    throw new Error('Favicon: Missing masterPicture value');
  }
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Favicon: Missing output value');
  }
  return config;
};

const resolveConfig = (config) => {
  const dynamicConfig = resolveDynamicValues(config);
  const merged = jsdeep.deepMerge(defaultConfig, config, dynamicConfig);
  return validateConfig(merged);
};

module.exports = resolveConfig;
