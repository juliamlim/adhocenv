// Deploy: ingress
const path = require('path');
const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { ingress } = config.kubectl;

  // const { host = false, branch } = config;
  // const { ingress } = config.kubectl;
  // const namespaceFlag = `--namespace=${config.namespace}`;
  // // let deployPaths = [ kubectl.ingressPath(branch.name) ];

  try {
    kubectl.execCheck('ingress', ingress.name).then((res) => {
      if (res.match)
      kubectl.yamlApply(path.dirname(__filename), (str) => )
    });
  //   // Get ingress json from kubectl on gcp
  //   // const ingressJson = execSync(`kubectl get ingress ${ingress.name} -o=json ${namespaceFlag}`, { encoding: 'utf-8' });

  //   // Grab rules from the ingress
  //   // const rules = JSON.parse(ingressJson).spec.rules || [];

  //   // Check for host rules or the first set of rules
  //   // const rule = (host ? rules.filter(r => r.host === host)[0] : rules.filter(r => typeof r.host === 'undefined')[0]) || [];

  //   // Grab path names from rule
  //   const paths = []; // rule.length ? rule.http.paths.filter(p => p.path !== '/').map(p => p.path) : [];
  //   const deployPath = kubectl.ingressPath(branch.name);

  //   // If paths don't include branch name than add path
  //   if ( !paths.includes(deployPath) ) {
  //     paths.push(deployPath);
  //   }

  //   // Update the ingress
  //   kubectl.baseIngress(config, kubectl.ingressRule(config, paths));
  //   execSync(`kubectl apply -f ${ingress.path} ${namespaceFlag}`);

  } catch (error) {
    die(`There was an error deploying the image to gcp: ${error}`);
  }
  log('Ingress updated');
}

