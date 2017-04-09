const { isOutputUpToDate } = require('./changed');

const onTrue = action => (value) => {
  if (value) action();
  return value;
};

const reuseOutput = config =>
  isOutputUpToDate(config)
    .then(onTrue(() => config.log(`Reusing output ${config.output}. Output is up to date.`)));

module.exports = reuseOutput;
