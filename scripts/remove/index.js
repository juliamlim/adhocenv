/** Remove-Branch Script */
const { log } = require('../../lib/utils');

module.exports = (config) => {
  require('./_ingress')(config);
  require('./_container')(config);
};
