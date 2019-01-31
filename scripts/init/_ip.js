/** Init Script - IP */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const gcloud = require('../../lib/gcloud');

module.exports = (config = {}) => {
  const { ip } = config.kubectl;

  try {
    log('Checking IP address');
    if (!gcloud.ipExists(ip)) {
      log('Creating static ip address');
      execSync(`gcloud compute addresses create ${ip} --global`);
    }
  } catch (error) {
    die(error);
  }
};
