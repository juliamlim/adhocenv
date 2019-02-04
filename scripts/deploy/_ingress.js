// Deploy: ingress
const path = require('path');
const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { host = false, namespace, branch } = config;
  const { ingress } = config.kubectl;
  // let deployPaths = [ kubectl.ingressPath(branch.name) ];

  try {
    // // Get ingress json from kubectl on gcp
    // const ingressJson = execSync(`kubectl get ingress ${ingress.name} -o=json ${namespaceFlag}`, { encoding: 'utf-8' });

    // // Grab rules from the ingress
    // const rules = JSON.parse(ingressJson).spec.rules || [];

    // // Check for host rules or the first set of rules
    // const rule = (host ? rules.filter(r => r.host === host)[0] : rules.filter(r => typeof r.host === 'undefined')[0]) || [];

    // // Grab path names from rule
    // const paths = rule.length ? rule.http.paths.filter(p => p.path !== '/').map(p => p.path) : [];
    // const deployPath = kubectl.ingressPath(branch.name);

    // // If paths don't include branch name than add path
    // if ( !paths.includes(deployPath) ) {
    //   paths.push(deployPath);
    // }

    kubectl.execCheck('ingress', ingress.name, { namespace }).then((res) => {
      let paths = [];

      if (res.exists) { // Grab information from current ingress configuration
        const currentIng = res.items.filter(item => item.metadata.name === ingress.name) || {};
        const currentRule = currentIng.spec.rules.filter(rule => rule.host === host) || {};
        // Grab service names ( service names are defined by the branch name )
        paths = currentRule.length ? currentRule.http.paths.map(path => path.backend.serviceName) : [];
      }

      // If branch name is not included fanout add it
      if (!paths.includes(branch.name)) paths.push(branch.name);

      // Create new rule object to be applied to kubernetes
      const rule = kubectl.ingressRule(paths, host, namespace); // @todo !!!!!!!!!!!!!!!


      // kubectl.yamlApply(path.dirname(__filename), (str) => )
    });

  } catch (error) {
    die('There was an error deploying the image to gcp', error);
  }
  log('Ingress updated');
}

