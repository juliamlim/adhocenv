const { execSync } = require('child_process');
const { log, die, cmdText } = require('../lib/utils');

let config = require(`${process.cwd()}/.autodeploy.json`) || null;

module.exports = (cmd, flags) => {
  return new Promise((resolve) => {
    if (cmd !== 'help') {
      // Configure the data
      // @todo setup script if no
      // config = !config ? require('./setup')() : config;
      flags = parseFlags(flags);
      config.namespace = flags.namespace ? flags.namespace : config.namespace;

      log(`Starting up autodeploy with the ${config.namespace} namespace`);

      // Set other data values
      config.branch = getBranchValues();
      config.project = getConsoleProject();
      config.kubectl = setKubectlValues(config, flags);
      config.imagePath = setImagePath(config, flags.imageHost);
    }


    resolve(configOverride(config, flags));
  });
};

/**
 * Get branch values from git logs
 *
 * @returns {Object} Contains shortened commit hash and branch name
 */
getBranchValues = () => {
  const cmd = 'git log --format="%h%d" -1';
  try {
    const [val, hash = '', name = ''] = execSync(cmd, { encoding: 'utf-8' })
      .match(/([0-9a-f]{8}) \(HEAD -> ([^,\)]*).*/);
    return { hash, name: name.toLowerCase() };
  } catch (error) {
    die(`Could not parse branch data from ${cmdText(cmd)}\n${error}. Verify you are on a branch.`);
  }
}

/**
 * Get the name of the gcloud project
 *
 * @returns {string} Project name
 */
getConsoleProject = () => {
  const cmd = 'gcloud config get-value project';
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch (error) {
    die(`Could not return project name in ${cmdText(cmd)}\n${error}`);
  }
}

/**
 * Parse flags in the cmd
 *
 * @returns {Object} Flags for script
 */
parseFlags = (flags = {}) => {
  return {
    ...flags,
    imageHost: flags.imageHost || 'gcr.io',
    build: flags.build || 'production',
    skipBuild: typeof flags.skipBuild === 'string' || false,
    skipDocker: typeof flags.skipDocker === 'string' || false,
    skipIp: typeof flags.skipIp === 'string' || false,
    staticIp: flags.staticIp || false,
  }
};

/**
 * Set config values and flag overrides
 *
 * @returns {Object} Config
 */
configOverride = (config, flags) => {
  const { namespace, branch } = flags;

  return {
    ...config,
    namespace: namespace || config.namespace,
    branch: branch ? { name: branch.toLowerCase() } : config.branch,
    flags,
  };
}

/**
 * Configure image path
 *
 * @param {Object} config Config information
 * @param {string} host Host where docker images are kept
 */
setImagePath = (config, host) => {
  const { project } = config;
  const { name, hash } = config.branch;
  // gcr.io/services-123456/CVS-1234:abcd1234
  return `${host}/${project}/${name}:${hash}`;
};

/**
 * Set variables for kubectl cli
 *
 * @param {Object} config Config information
 * @param {Object} flags Flags from the script
 */
setKubectlValues = (config, flags) => {
  const { namespace } = config;
  return {
    ingress: {
      fanout: flags.fanout || `${namespace}-fanout`,
      name: flags.ingress || `${namespace}-ingress`,
      path: `${process.cwd()}/autodeploy/lib/ingress.json`,
      nginx: `${process.cwd()}/autodeploy/lib/nginx-ingress.json`,
    },
    ip: flags.staticIp || `${namespace}-static-ip`,
    nginx: flags.nginx || `${namespace}-nginx`,
  }
};
