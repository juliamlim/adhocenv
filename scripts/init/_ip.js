/** Init Script - IP */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');

module.exports = (config = {}) => {
  const { ip } = config.kubectl;

  try {
    log('Checking IP address');
    let address = execSync(`gcloud compute addresses list --filter="name=('${ip}')"`, { encoding: 'utf-8' });

    console.log(address);
    if (!address) {
      log('Creating static ip address');
      execSync(`gcloud compute addresses create ${ip} --global`);
    }
  } catch (error) {
    die(error);
  }
};
