require('mocha-metatitles');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.config.includeStack = true;
chai.config.showDiff = true;
global.expect = chai.expect;
chai.use(chaiAsPromised);
