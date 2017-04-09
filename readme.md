# favico - Node.js API

[![Travis Build](https://img.shields.io/travis/coditorium/nodejs-favico.svg?style=flat-square)](https://travis-ci.org/coditorium/nodejs-favico)
[![Coverage](https://img.shields.io/coveralls/coditorium/nodejs-favico.svg?style=flat-square)](https://coveralls.io/github/coditorium/nodejs-favico)
[![NPM Version](https://img.shields.io/npm/v/favico.svg?style=flat-square)](http://npm.im/favico)
[![NPM Downloads](https://img.shields.io/npm/dm/favico.svg?style=flat-square)](http://npm-stat.com/charts.html?package=favico)

Small favicon generator.

## Features

- Provides Node.js API and CLI for [RealFaviconGenerator](https://realfavicongenerator.net/)
- Provides caching.

## Examples

**Sample usage via Node.js API**

```js
const favico = require("favico");

favico(config)
  .then(() => console.log("Favicons are generated"));
```

**Sample usage via CLI**

```sh
favico -h
favico --config ./favicons.json
```

## Configuration

Configuration file consists mostly of properties from [RealFaviconGenerator non-interactive api](https://realfavicongenerator.net/api/non_interactive_api).
Favico use provides some useful [defaults](lib/config.js) and have few additional fields:

- `output` [required, String] - Path to output directory.
- `reuseOutput` [optional, Boolean] - Do not download favicons if output directory is up to date.
- `cache` [optional, String] - Path to cache directory. If is not set or set to false cache is disabled. Default value: `false`.
- `log` [optional, Function/Boolean] - Function to be used for logging. It it is true then `console.log` is used. Default value: `false`.

Sample config:

```json
{
  "output": "./build/favicons",
  "reuseOutput": true,
  "cache": "./.cache/favicons",
  "iconsPath": "/favicons",
  "masterPicture": "./favicon.png",
  "log": true,
  "design": {
    "ios": {
      "pictureAspect": "backgroundAndMargin",
      "backgroundColor": "#ffffff",
      "margin": "14%"
    },
    "desktopBrowser": {},
    "windows": {
      "pictureAspect": "noChange",
      "backgroundColor": "#da532c",
      "onConflict": "override"
    },
    "androidChrome": {
      "pictureAspect": "shadow",
      "themeColor": "#b5b5b5",
      "manifest": {
        "display": "browser",
        "orientation": "notSet",
        "onConflict": "override",
        "declared": true
      }
    },
    "safariPinnedTab": {
      "pictureAspect": "silhouette",
      "themeColor": "#5bbad5"
    }
  },
  "settings": {
    "scalingAlgorithm": "Mitchell",
    "errorOnImageTooSmall": false
  }
}
```
