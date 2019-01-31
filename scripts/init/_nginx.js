/** Init Script - Nginx */

const { log, die, cmdText } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { namespace } = config;
  const { nginx } = config.kubectl;

  try {
    log('Starting container creation');

    kubectl.execCheck('namespaces', config.namespace, { add: `kubectl create namespace ${config.namespace}` });
    kubectl.execCheck('deployment', nginx, { add: `kubectl run ${nginx} --image=nginx --port=80`, namespace});
    kubectl.execCheck('service', nginx, { add: `kubectl expose deployment ${nginx} --target-port=80 --type=NodePort`, namespace });

  } catch (error) {
    log(`If you haven't connected to the cluster, please run
    ${cmdText(`gcloud container clusters get-credentials <cluster-name> --zone=<zone-name> --project=${config.project}`)}`, 'yellow');
    die(error);
  }
  log(`${nginx} container is up and running`);
};
