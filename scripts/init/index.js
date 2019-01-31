/** Init Script */

module.exports = (config) => {
  log('Starting Init Process', 'green');
  require('./_ip')(config);
  require('./_nginx')(config);
  require('./_ingress')(config);
}
