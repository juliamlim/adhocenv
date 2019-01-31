/** Deploy Script */
const { log } = require('../../lib/utils');

module.exports = (config) => {
  log('Start deploy', 'green');
  require('./_build')(config);
  require('./_docker')(config);
  require('./_container')(config);
  require('./_ingress')(config);
};
