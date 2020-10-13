// Deploy: ingress
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { host = false, namespace, branch } = config;
  const { ingress, ip } = config.kubectl;

  try {
    log('Updating ingress');
    kubectl.execCheck('ingress', ingress, { namespace }).then((res) => {
      const currentIng = res.items.find(item => item.metadata && item.metadata.name === ingress);
      const currentRules = currentIng ? currentIng.spec.rules : [];

      let rule = currentRules.length ? host
        ? currentRules.find(rule => rule.host === host)
        : currentRules.find(rule => !('host' in rule))
        : undefined;

      // Grab deployment names ( defined by the branch name )
      let paths = rule ? rule.http.paths.map(path => path.backend.serviceName) : [];

      // Adds deployment to ingress if not present
      if (!paths.includes(branch.name)) {
        paths.push(branch.name);

        // Create new rule object to be applied to kubernetes
        rule = kubectl.ingressRule(paths, host);
      }

      const data = { namespace, ingress, rules: [...currentRules.filter(rules => rules.host !== rule.host), rule], ip };

      kubectl.fileApply(`${config.root}/resources/ingress.json`, (str) => JSON.stringify(Object.assign(
        JSON.parse(str),
        kubectl.generateIngress(data)
      )));

      log('Ingress updated');
    });
  } catch (error) {
    die('There was an error deploying the image to gcp', error);
  }
}

