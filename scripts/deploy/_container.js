// Deploy: container
const { execSync } = require('child_process');
const { die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { branch, imagePath, port, namespace } = config;
  const namespaceFlag = `--namespace=${config.namespace}`;

  try {
    kubectl.execCheck('deployments', branch.name, { namespace }).then((res) => {
      if (res.exists) {
        execSync(`kubectl set image deployment/${branch.name} ${branch.name}=${imagePath} ${namespaceFlag}`);
      } else {
        // kubectl.fileApply(`${config.root}/resources/deployment.json`, () => kubectl.generateDeployment({ name: branch.name, namespace, image: imagePath}));
        execSync(`kubectl run ${branch.name} --image=${imagePath} --port=${port} ${namespaceFlag}`);
        execSync(`kubectl expose deployment ${branch.name} --target-port=${port} --port=80 --type=NodePort ${namespaceFlag}`);
      }
      log('Finished deploying image');
    });
  } catch (error) {
    die('There was an error deploying the image to gcp', error);
  }
}
