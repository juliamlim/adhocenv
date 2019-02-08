// Init script
module.exports = (config) => {
  require('./_ip')(config);
  require('./_kubernetes')(config);
};
