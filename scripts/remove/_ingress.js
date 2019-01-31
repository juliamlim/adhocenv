/** Deploy Script - Ingress */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { branch } = config;
  const { ingress } = config.kubectl;
  const namespaceFlag = `--namespace=${config.namespace}`;

  try {
    const ingressJson = execSync(`kubectl get ingress ${ingress.name} -o=json ${namespaceFlag}`, { encoding: 'utf-8' });
    const paths = JSON.parse(ingressJson).spec.rules[0].http.paths || [];
    const deployPath = kubectl.ingressPath(branch.name);

    kubectl.baseIngress(config, paths.filter(p => p.path !== deployPath));
    execSync(`kubectl apply -f ${ingress.path} ${namespaceFlag}`);
  } catch (error) {
    die(`There was an error deploying the image to gcp: ${error}`);
  }
  log('Ingress updated');
}

