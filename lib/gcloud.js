/** gCloud Wrapper */

const { execSync } = require('child_process');
const { die } = require('../lib/utils');

/**
 * Checks to see if the item exsists in the console before it's created
 * "Check yourself before you exec yourself." ~ @dayfa1r
 *
 * @param {String} type       The type of item you are checking
 * @param {String} name       The name of the item you want to create
 * @param {String} cmd        The command you want to exectue if the item doesn't exist
 * @param {String} namespace  The namespace the item is under
 *
 * @returns {Array} The list of items that were returned from kubernetes
 */
execCheck = (type) => new Promise ((resolve, reject) => {
  try {
    resolve({ list: execSync(`gcloud compute ${type} list`, { encoding: 'utf-8' }) });
  } catch (error) {
    reject(error);
  }
});

/**
 * Check to see if the static-ip exists and
 * isn't IN_USE
 *
 * @returns {boolean}
 */
ipExists = (name) => {
  try {
    let address = execSync(`gcloud compute addresses list --filter="name=('${name}')"`, { encoding: 'utf-8' });
    return !!address;
  } catch (error) {
    die('There was an error checking for the IP address', error);
  }
}

module.exports = { ipExists };
