// Deploy script
module.exports = (config) => new Promise(
  (resolve) => resolve(require('./_build')(config)))
  .then(() => require('./_docker')(config))
  .then(() => require('./_container')(config))
  .then(() => require('./_ingress')(config));
