// Init: kubernetes

const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  log('Setting up kubernetes');

  try {
    kubectl.execCheck('namespaces', config.namespace, { add: `kubectl create namespace ${config.namespace}` });
  } catch (error) {
    die(error);
  }
};
