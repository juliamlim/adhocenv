// Deploy: build
const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');

module.exports = (config) => {
  log(`Starting ${config.flags.build} build`, 'green');
  try {
    const buildScript = config.deployments[config.flags.build].build || config.deployments[config.flags.build].default;
    execSync(buildScript, {stdio: 'inherit'});
  } catch (error) {
    die('Failed building the project', error);
  }
  log('Finished build');
};
