/** Kubernetes Helper Wrap */

const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { arrayify } = require('../lib/utils');

/**
 * Checks to see if the item exsists in the console before it's created
 * "Check yourself before you exec yourself." ~ @dayfa1r
 *
 * @param {String} type       The type of item you are checking
 * @param {String} name       The name of the item you want to create
 * @param {String} cmd        The command you want to exectue if the item doesn't exist
 * @param {String} namespace  The namespace the item is under
 *
 * @returns {Array} The list of items that were returned from kubernetes
 */
execCheck = (type, name, opts = {}) => new Promise ((resolve, reject) => {
  const { namespace = false, add = '', remove = '' } = opts;
  const namespaceFlag = namespace ? ` --namespace=${namespace}` : '';

  const list = execSync(`kubectl get ${type} -o=jsonpath='{.items[*].metadata.name}'${namespaceFlag}`, { encoding: 'utf-8' }).split(' ');

  if ( add && (!list.length || !list.includes(name)) ) {
    try {
      execSync(`${add}${namespaceFlag}`, {stdio: 'inherit'});
    } catch (error) {
      reject(error);
    }
  }

  if ( remove && (list.length && list.includes(name)) ) {
    try {
      execSync(`${remove}${namespaceFlag}`, {stdio: 'inherit'});
    } catch (error) {
      reject(error);
    }
  }

  resolve({ list, exists: list.length && list.includes(name) });
});

/**
 * This is the template for the inital ingress file for kubernetes
 *
 * @param {Object}  config  The autodeploy config
 * @param {Array}   paths   The new paths that need to be applied to the ingress e.g.[{path: '/', backend: { serviceName: 'service', servicePort: 80 }}]
 */
baseIngress = (config = {}, rules = []) => {
  const { namespace } = config;
  const { ingress, ip, nginx } = config.kubectl;

  const ingressJson = {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    metadata: {
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
        'ingress.kubernetes.io/rewrite-target': '/',
        'kubernetes.io/ingress.global-static-ip-name': ip
      },
      name: ingress.name,
      namespace
    },
    spec: {
      backend: {
        serviceName: nginx,
        servicePort: 80
      },
      rules: arrayify(rules)
    }
  };
  writeFileSync(ingress.path, JSON.stringify(ingressJson), { encoding: 'utf-8' });
}

/**
 * This is the object that needs to be added to the
 * rule spec in the kubernetes ingress.
 *
 * @param {Object} config   The autodeploy config
 *
 * @returns {Object}
 */
ingressRule = (config) => {
  const { branch, host } = config
  return {
    host: `${branch.name}.${host}`,
    http: {
      paths: [
        {
          path: '/*',
          backend: {
            serviceName: branch.name,
            servicePort: 80
          }
        }
      ]
    }
  };
}

module.exports = { baseIngress, execCheck, ingressRule };
