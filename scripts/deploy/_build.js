// Deploy: build
const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');

module.exports = (config) => {
  if (config.flags.skipBuild) return log('Skipped build');

  const build = getBuild(config) || 'default';
  log(`Starting ${build} build`, 'green');
  try {
    const buildScript = config.builds[build].cmd || config.builds.default.cmd;
    execSync(buildScript, {stdio: 'inherit'});
  } catch (error) {
    die('Failed building the project', error);
  }
  return log('Finished build');
};

getBuild = config => {
  const { builds = {} } = config;
  return config.flags.build ? config.flags.build : Object.keys(builds).find(b => builds[b].default);
}
