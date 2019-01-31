/** Deploy Script - Ingress */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { branch, namespace } = config;
  const { ingress } = config.kubectl;
  const namespaceFlag = `--namespace=${config.namespace}`;

  try {
    // Check to see if ingress exists
    kubectl.execCheck('ingress', ingress.name, { namespace }).then((res) => {

      // Get ingress JSON
      const ingressJson = execSync(`kubectl get ingress ${ingress.name} -o=json ${namespaceFlag}`, { encoding: 'utf-8' });

      // Grab all paths
      const paths = JSON.parse(ingressJson).spec.rules[0].http.paths || [];

      // Format path for branch
      const deployPath = kubectl.ingressPath(branch.name);

      // Filter out the deploy path
      kubectl.baseIngress(config, paths.filter(p => p.path !== deployPath));

      // Apply ingress to kubernetes
      execSync(`kubectl apply -f ${ingress.path} ${namespaceFlag}`);
    });
  } catch (error) {
    die('There was an error removing the deployment from gcp', error);
  }
  log('Ingress updated');
}

