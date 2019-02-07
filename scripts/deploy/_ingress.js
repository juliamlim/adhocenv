// Deploy: ingress
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { host = false, namespace, branch } = config;
  const { ingress, ip } = config.kubectl;

  try {
    kubectl.execCheck('ingress', ingress, { namespace }).then((res) => {
      const currentIng = res.items.filter(item => item.metadata && item.metadata.name === ingress);
      const currentRules = currentIng.length ? currentIng.spec.rules : [];

      let rule = currentRules.length ? host
        ? currentRules.filter(rule => rule.host === host)
        : currentRules.filter(rule => !('host' in rule))
        : [];

      // Grab deployment names ( defined by the branch name )
      let paths = rule.length ? rule.http.paths.map(path => path.backend.serviceName) : [];

      // Adds deployment to ingress if not present
      if (!paths.includes(branch.name)) {
        paths.push(branch.name);

        // Create new rule object to be applied to kubernetes
        rule = kubectl.ingressRule(paths, host);
      }

      const data = { namespace, ingress, rules: [...currentRules, rule], ip };

      kubectl.yamlApply(`${config.root}/resources/ingress.json`, (str) => JSON.stringify(Object.assign(
        JSON.parse(str),
        kubectl.generateIngress(data)
      )));

      log('Ingress updated');
    });
  } catch (error) {
    die('There was an error deploying the image to gcp', error);
  }
}

