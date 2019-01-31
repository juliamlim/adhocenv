/** Deploy Script - Container */

const { execSync } = require('child_process');
const { die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { namespace } = config;
  const { branch, imagePath } = config;

  try {
    kubectl.execCheck('service', branch.name, { remove: `kubectl delete service ${branch.name}`, namespace });
    kubectl.execCheck('deployment', branch.name, { remove: `kubectl delete deployment ${branch.name}`, namespace });
    kubectl.execCheck('pods', branch.name, { namespace }).then((res) => {
      const pod = res.list.find((v) => v.includes(branch.name));
      if (pod) {
        execSync(`kubectl delete pod ${pod} --namespace=${namespace}`);
      }
    });
  } catch (error) {
    die(`There was an error removing the branch ${error}`);
  }
}
