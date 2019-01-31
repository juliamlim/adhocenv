/** Deploy Script - Container */

const { execSync } = require('child_process');
const { die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { namespace } = config;
  const { branch } = config;

  try {
    kubectl.execCheck('service', branch.name, { remove: true, namespace });
    kubectl.execCheck('deployment', branch.name, { remove: true, namespace });
    kubectl.execCheck('pods', branch.name, { remove: true, namespace });
  } catch (error) {
    die('There was an error removing the branch from kubernetes', error);
  }
}
