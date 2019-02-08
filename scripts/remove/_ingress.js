// Remove: ingress
const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { branch, namespace, host = false } = config;
  const { ingress, ip } = config.kubectl;
  const namespaceFlag = `--namespace=${config.namespace}`;

  try {
    // Check to see if ingress exists
    kubectl.execCheck('ingress', ingress, { namespace }).then((res) => {
      if (res.exists) {
        const currentIng = res.items.find(item => item.metadata && item.metadata.name === ingress);
        const currentRules = currentIng ? currentIng.spec.rules : [];

        let rule = currentRules.length ? host
          ? currentRules.find(rule => rule.host === host)
          : currentRules.find(rule => !('host' in rule))
          : [];

        let paths = rule ? rule.http.paths.filter(path => path.backend.serviceName !== branch.name) : [];

        if (paths.length) {
          rule = kubectl.ingressRule(paths, host);
          const data = { namespace, ingress, rules: [...currentRules, rule], ip };

          kubectl.yamlApply(`${config.root}/resources/ingress.json`, (str) => JSON.stringify(Object.assign(
            JSON.parse(str),
            kubectl.generateIngress(data)
          )));
        } else {
          log('No branches left, ingress will be deleted');
          execSync(`kubectl delete ingress ${ingress} ${namespaceFlag}`, {stdio: 'inherit'});
        }
      }
    });
  } catch (error) {
    die('There was an error removing the deployment from gcp', error);
  }
  log('Ingress updated');
}

