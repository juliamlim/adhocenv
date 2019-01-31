const { execSync } = require('child_process');
const { die } = require('../lib/utils');
const kubectl = require('../lib/kubectl');
const gcloud = require('../lib/gcloud');

module.exports = (config = {}) => {
  const { ip } = config.kubectl;

  try {
    kubectl.execCheck('namespaces', config.namespace, {
      remove: `kubectl delete namespace ${config.namespace}`
    });

    // Check to see if static ip exists
    if (!config.flags.skipIp && gcloud.ipExists(ip)) {
      execSync(`gcloud compute addresses delete ${ip} --global`, {stdio: 'inherit'});
    }
  } catch (error) {
   die(error);
  }
}
