// Remove script
module.exports = (config) => new Promise(
  (resolve) => resolve(require('./_ingress')(config)))
  .then(() => require('./_container')(config));
