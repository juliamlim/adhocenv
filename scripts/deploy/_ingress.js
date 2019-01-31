/** Deploy Script - Ingress */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { host, branch } = config;
  const { ingress } = config.kubectl;
  const namespaceFlag = `--namespace=${config.namespace}`;

  try {
    const ingressJson = execSync(`kubectl get ingress ${ingress.name} -o=json ${namespaceFlag}`, { encoding: 'utf-8' });
    const rules = JSON.parse(ingressJson).spec.rules || [];

    const deployRule = kubectl.ingressRule(config);

    if ( rules.filter((r) => r.host === deployRule.host).length === 0 ) {
      log(`Adding ${deployRule.host} path to ingress`);
      rules.push(deployRule);
    } else {
      log(`Updating ${deployRule.host} path to ingress`);
    }

    kubectl.baseIngress(config, rules);
    execSync(`kubectl apply -f ${ingress.path} ${namespaceFlag}`);
  } catch (error) {
    die(`There was an error deploying the image to gcp: ${error}`);
  }
  log('Ingress updated');
}

