// Deploy: docker
const { execSync } = require('child_process');
const { die } = require('../../lib/utils');

module.exports = (config) => {
  log('Building docker image')
  const { name, hash } = config.branch;
  try {
    // @todo We need to define all the variables that can be accessed by the dockerfile here
    // FROM <docker image> xxx no not this, this can just be contained and maintained in the dockerfile
    // Branch name
    // Build ( prod, dev, etc.. )
    // Build command (only the command for the build)
    execSync(`docker build -t ${config.imagePath} .`);
    execSync('gcloud auth configure-docker');
    execSync(`docker push ${config.imagePath}`);
  } catch (error) {
    die('There was an error creating and publishing the docker image', error);
  }
  log(`Image ${name}:${hash} published`);
};
