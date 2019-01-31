/** Remove-Branch Script */
const { log } = require('../../lib/utils');

module.exports = (config) => {
  log('Start deploy', 'green');
  // @todo finish this - ability to pick up where you left off if the script errors at anypoint in time
  // either:
  // a) run entire script again but place checks to see what already exists
  // b) flag for what spot you want to execute the script from
  // c) log out remaining scripts that have to be executed to be completed manually
  require('./_ingress')(config);
  require('./_container')(config);
};
