// Deploy: docker
const { execSync } = require('child_process');
const { camelToScreaming, die } = require('../../lib/utils');

module.exports = (config) => {
  if (config.flags.skipDocker) return log('Skipped Docker image build');

  log('Building docker image');
  const { name, hash } = config.branch;
  try {
    // @todo We need to define all the variables that can be accessed by the dockerfile here
    // FROM <docker image> xxx no not this, this can just be contained and maintained in the dockerfile
    // Branch name
    // Build ( prod, dev, etc.. )
    // Build command (only the command for the build)
    const vars = dockerArgs(config);

    execSync(`docker build -t ${config.imagePath} ${vars} .`, { stdio: 'inherit' });
    execSync('gcloud auth configure-docker');
    execSync(`docker push ${config.imagePath}`, { stdio: 'inherit' });
  } catch (error) {
    die('There was an error creating and publishing the docker image', error);
  }

  return log(`Image ${name}:${hash} published`);
};

dockerValues = (config) => {
  return {
    BUILD: config.build || 'default',
    BRANCH: config.branch.name || null
  };
};

dockerArgs = (config = {}) => {
  const { docker = {} } = config;
  return docker.args && docker.args.length ? docker.args.map(a => `--build-arg ${a.toUpperCase()}=${dockerValues(config)[a.toUpperCase()]}`).join(' ') : '';
}

dockerVariables = obj => {
  const values = Object.keys(obj).map(k => `--build-arg ${camelToScreaming(k)}=${obj[k]}`);
  return values.join(' ');
}


