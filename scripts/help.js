const { log, text } = require('../lib/utils');

const gb = ` ${text('      ', 'inverse')}
${text('  ', 'inverse')}${text('  ', 'bgYellow')}  ${text('  ', 'inverse')}
${text('  ', 'inverse')}  ${text('  ', 'bgGreen')}${text('  ', 'inverse')}  Thanks for using ${text('Gb-Autodeploy!', 'green')}
${text('  ', 'inverse')}${text('  ', 'bgCyan')}  ${text('  ', 'inverse')}  Version 0.0.0
 ${text('    ', 'inverse')} ${text('  ', 'inverse')}
      ${text('  ', 'inverse')}
  ${text('     ', 'inverse')}   Usage:
`

const help = `${gb}

$ ${text('node ./path/to/gb-autodeploy', 'white')} ${text('<command>', 'cyan')} ${text('--', 'white')} ${text('[options]', 'blue')}

Commands:

${text('init', 'cyan')}       Set up autodeploy for a new client
${text('deploy', 'cyan')}     Deploy current branch to gcp
${text('teardown', 'cyan')}   ${text('WARNING', 'yellow')} This removes the everything under the namespace, and is irreversible
${text('help', 'cyan')}       List commands

Options:

${text('--image-host[=string]', 'blue')}  The host that stores docker images. Default=gcr.io.
${text('--namespace[=string]', 'blue')}   Flag to change the namespace your working under.

Specific script flags:
  ${text('deploy', 'cyan')}:
    ${text('--skip-build[=boolean]', 'blue')}  Skips the build step in deploy.
`;

module.exports = () => {
  log(help);
}
