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
${text('deploy', 'cyan')}     Deploy the current branch to gcp
${text('remove', 'cyan')}     Remove a specific branch from gcp (branch can be defined in flag)
${text('teardown', 'cyan')}   ${text('WARNING', 'yellow')} This removes the everything under the namespace, and is ${text('irreversible', 'bold')}
${text('help', 'cyan')}       List commands

Options:

${text('--image-host[=string]', 'blue')}  The host that stores docker images. Default=gcr.io.
${text('--namespace[=string]', 'blue')}   Flag to change the namespace your working under.

Specific script flags:
  ${text('deploy', 'cyan')}:
    ${text('--skip-build', 'blue')}   Skips the build step in deploy.
    ${text('--skip-docker', 'blue')}  Skips the build step in deploy.

  ${text('remove', 'cyan')}:
    ${text('--branch[=string]', 'blue')}  Define what branch you want to remove, if not defined will remove current branch.

`;

module.exports = () => {
  log(help);
}
