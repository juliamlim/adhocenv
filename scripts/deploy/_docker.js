// Deploy: docker
const { execSync } = require('child_process');
const { die } = require('../../lib/utils');

module.exports = (config) => {
  log('Building docker image')
  const { name, hash } = config.branch;
  try {
    if ( !config.flags['skip-docker'] ) {
      execSync(`docker build -t ${config.imagePath} .`);
      execSync('gcloud auth configure-docker');
      execSync(`docker push ${config.imagePath}`);
    }
  } catch (error) {
    die('There was an error creating and publishing the docker image', error);
  }
  log(`Image ${name}:${hash} published`);
};
