// Init script
module.exports = (config) => new Promise(
  (resolve) => resolve(require('./_ip')(config)))
  .then(() => require('./_kubernetes')(config));
