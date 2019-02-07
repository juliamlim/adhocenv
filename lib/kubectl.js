// Kubernetes wrapper
const path = require('path');
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { arrayify, die, log } = require('../lib/utils');

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

  resolve({ exists: !!match.length, match, items });
});

/**
 * Applies parsed yaml file to kubectl
 *
 * @param {string} path   Path to the file
 * @param {Object} data   Values to be injected into the string
 */
yamlApply = (file, parse = false) => {
  // Grab string from template file
  let str = readFileSync(file, 'utf8').toString();

  // Define tmp file to be created
  const tmp = `${path.dirname(__filename)}/tmp${file.match(/(\.[a-z]+)$/)[0]}`;

  // Update string with new data
  if (typeof parse === 'function') str = parse(str);

  // Create tmp file
  writeFileSync(tmp, str, { encoding: 'utf-8' });

  die(str);
  // Apply tmp file to kubernetes
  execSync(`kubectl apply -f ${tmp} --dry-run`, { stdio: 'inherit' });

  // Delete tmp file
  execSync(`rm ${tmp}`);
};

/**
 * Generates ingress data for kuberbetes
 *
 * @param {Object} data  Data that will be injected into file
 *
 * @returns {string}  String representing data for .json file
 */
generateIngress = (data = {}) => {
  const {
    namespace = 'default',
    ip = '',
    rules = [],
    ingress
  } = data;

  return {
    metadata: {
      annotations: {
        'kubernetes.io/ingress.global-static-ip-name': ip
      },
      name: ingress,
      namespace
    },
    spec: {
      rules
    }
  };
}

/**
 * Generates the path array for a single ingress rule
 *
 * @param {Array} paths   An array of path names
 */
generatePaths = (paths, port = 80) => {
  return paths.map( path => ({
    path: `/${path}/*`,
    backend: {
      serviceName: path,
      servicePort: port
    }
  }));
}

/**
 * This is the object that needs to be added to the
 * rule spec in the kubernetes ingress.
 *
 * @param {Object} config   The autodeploy config
 *
 * @returns {Object}
 */
ingressRule = (paths = [], host = false) => {
  const data = {
    http: {
      paths: generatePaths(paths)
    }
  };

  if (host) data.host = host;

  return data;
}

module.exports = { execCheck, generateIngress, ingressRule, yamlApply };
