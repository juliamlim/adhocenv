const { execSync } = require('child_process');
const { log, die } = require('../lib/utils');

module.exports = (config = {}) => {
  try {
    const namespace = execSync(`kubectl get namespace ${config.namespace} -o=jsonpath='{.metadata.name}'`);
    if (namespace.length) {
      execSync(`kubectl delete namespace ${config.namespace}`, {stdio: 'inherit'});
    }
    execSync(`gcloud compute addresses delete ${config.kubectl.ip} --global`, {stdio: 'inherit'});
  } catch (error) {
   die(error);
  }
  log('Teardown complete', 'blue');
}
