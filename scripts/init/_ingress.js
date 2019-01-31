/** Init Script - Ingress */

const { execSync } = require('child_process');
const { log, die } = require('../../lib/utils');
const kubectl = require('../../lib/kubectl');

module.exports = (config = {}) => {
  const { namespace } = config;
  const { ingress, ip } = config.kubectl;

  try {
    log('Applying ingress controller');

    const address = execSync(`gcloud compute addresses list --filter="name=('${ip}')"`, { encoding: 'utf-8' });

    if (!!address) {
      kubectl.execCheck('ingress', ingress.name).then((res) => {
        if (!res.exists) {
          kubectl.baseIngress(config);
          execSync(`kubectl apply -f ${ingress.path} --namespace=${namespace}`);
        }
      });
    }
  } catch (error) {
    die(error);
  }
  log(`Ingress has been applied`);
};
