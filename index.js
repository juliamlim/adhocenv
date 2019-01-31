#!/usr/bin/env node

const { log, die } = require('./lib/utils');

const cmd = process.argv[2];
const flags = process.argv.slice(3).reduce((json, flag) => {
  const [ str, key, value] = flag.match(/--(.*)=(.*)/);
  json[key] = value;
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
      return require(`./scripts/${cmd}`)(config);
    default:
      return require('./scripts/help')();
  }

}).then(() => {
  log(`Finished ${cmd} process`);
  // When script complete exit out of process
  process.exit(0);

}).catch((err) => {

  // If an error is caught kill the process
  die(err);

});
