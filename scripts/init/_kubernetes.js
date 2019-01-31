/** Init Script - Kubernetes */

const { die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  log('Setting up kubernetes');
  try {
    kubectl.execCheck('clusterrolebinding', 'admin-users').then((res) => {
      if ( res.item ) {

        console.log(res.item.subjects)
      }
    });
    // kubectl.execCheck('clusterrolebinding', 'admin-users');.then((res) => {
    //   console.log(res);
    //   if (res.exists) {
    //   //   const admins = execSync(`kubectl describe clusterrolebinding admin-users -o=json`, { encoding: 'utf-8' });
    //     console.log("yaah");
    //   }
    // });
  } catch (error) {
    die('There was an error setting up the Kubernetes Engine', error);
  }
};
