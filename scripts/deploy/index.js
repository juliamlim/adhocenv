// Deploy script

module.exports = (config) => {
  if (!config.flags.skipBuild) require('./_build')(config);
  if (!config.flags.skipDocker) require('./_docker')(config);
  require('./_container')(config);
  require('./_ingress')(config);
};
