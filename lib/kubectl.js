// Kubectl wrapper

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { arrayify, log, parseString } = require('../lib/utils');

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

  // See if items exists
  const match = execSync(`kubectl get ${type}${namespaceFlag} | awk 'match($1, /${name}/) {print $1}'`, { encoding: 'utf-8' })
    .replace('\n', ' ') // Remove newlines
    .split(' ') // Split by spaces
    .filter(v => !!v); // Remove any false values from array

  // Grab the item(s) json if it exists
  let items = !!match.length
    ? JSON.parse(execSync(`kubectl get ${type} ${match}${namespaceFlag} -o=json`, { encoding: 'utf-8' }))
    : {};

  // Parse the data that comes back
  if (items.kind === 'List') {
    items = items.items;
  } else {
    items = arrayify(items);
  }

  // Safe addition
  if ( add && !match.length ) {
    try {
      if (typeof add === 'string') {
        log(`Adding ${name} ${type}`, 'yellow');
        execSync(`${add}${namespaceFlag}`, {stdio: 'inherit'});
      }
    } catch (error) {
      reject(error);
    }
  }

  // Safe removal
  if ( remove && match.length ) {
    try {
      log(`Removing ${name} ${type}`, 'yellow');
      if (typeof remove === 'string') {
        execSync(`${remove}${namespaceFlag}`, {stdio: 'inherit'});
      } else {
        execSync(`kubectl delete ${type} ${match.join(' ')}${namespaceFlag}`, {stdio: 'inherit'});
      }
    } catch (error) {
      reject(error);
    }
  }

  resolve({ exists: !!match.length, list, match, items });
});

/**
 * Applies parsed yaml file to kubectl
 *
 * @param {string} path   Path to the file
 * @param {Object} data   Values to be injected into the string
 */
yamlApply = (path, data) => {
  const str = readFileSync(path, 'utf8').toString();
  const parsed = parseString(str, data);

  // Create tmp file
  writeFileSync('tmp.yaml', parsed, { encoding: 'utf-8' });
  // Apply tmp file to kubernetes
  execSync(`kubectl apply -f tmp.yaml --dry-run`, { stdio: 'inherit' });
  // Delete tmp file
  execSync('rm tmp.yaml');
};

/**
 * This is the template for the inital ingress file for kubernetes
 *
 * @param {Object}  config  The autodeploy config
 * @param {Array}   paths   The new paths that need to be applied to the ingress
 */
baseIngress = (config = {}, rules = []) => {
  const { namespace } = config;
  const { ingress } = config.kubectl;

  const ingressJson = {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    metadata: {
      annotations: {
        'nginx.ingress.kubernetes.io/rewrite-target': '/'
        // 'nginx.ingress.kubernetes.io/server-snippet': nginxServerSnippet(),
      },
      name: 'cvs-fanout', //ingress.name,
      namespace
    },
    spec: {
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
ingressRule = (config, paths = []) => {
  const { host, port } = config;
  const { nginx } = config.kubectl;

  const data = {
    http: {
      paths: [{
        path: '/',
        backend: {
          serviceName: nginx,
          servicePort: 80
        }
      }, ...ingressPaths(paths, port)]
    }
  };
  if (host) data.host = host;

  return data;
}

/**
 * The path object for a single host
 *
 * @param {Array} paths   An array of path names
 */
ingressPaths = (paths, port = 80) => {
  return paths.map( path => ({
    path,
    backend: {
      serviceName: ingressPath(path, true),
      servicePort: port
    }
  }));
}

/**
 * The path pattern for an individual path
 * for an ingress deployment
 *
 * @param {String} name   Name for the slug
 */
ingressPath = (name = '', reverse = false) => {
  return reverse ? name.replace(/\/?(\S+)\/\?\(\.\*\)/, '$1') : `/${name}/?(.*)`;
}

module.exports = { baseIngress, execCheck, ingressPath, ingressPaths, ingressRule, nginxIngress, yamlApply };
