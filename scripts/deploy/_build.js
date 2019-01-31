/** Deploy Script - Build */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
/**
 * Build and prepare the necessary files for the docker image.
 *
 * @param {Object} config The object created by `config.js`
 */
module.exports = (config) => {
  log(`Starting ${config.flags.build} build`, 'green');
  try {
    const buildScript = config.deployments[config.flags.build].build || config.deployments[config.flags.build].default;
    if (!config.flags['skip-build']) {
      execSync(buildScript, {stdio: 'inherit'});
    }
  } catch (error) {
    die('Failed building the project');
  }
  log(`Finished build`);
};
