#!/usr/bin/env node

const { log, die } = require('./lib/utils');

const cmd = process.argv[2];
const flags = process.argv.slice(3).reduce((json, flag) => {
  const [, key, value] = flag.match(/--([^=\s]*)?=?(.*)/);
  // Convert kebab flags to camelCase
  json[key.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
  return json;
}, {});

// Configure the data needed in the script
require('./scripts/config')(cmd, flags).then((config) => {

  // Require and execute the command accordingly
  switch (cmd) {
    case 'init':
    case 'deploy':
    case 'remove':
    case 'teardown':
      log(`Start ${cmd} process`, 'green');
      return require(`./scripts/${cmd}`)(config);
    case 'help':
      return require('./scripts/help')();
    default:
      log(`There is no script available for ${cmd} \n`, 'yellow');
      return require('./scripts/help')();
  }
}).then(() => {

  // When script complete notify user and exit out of process
  if (cmd !== 'help') log(`Finished ${cmd} process`, 'blue');
  process.exit(0);
}).catch((err) => {

  // If an error is caught kill the process
  die(err);
});
