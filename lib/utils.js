const chalk = require('chalk');

/**
 * Log the needful.
 *
 * @param {string} msg
 * @param {string} type
 */
log = (msg, type = '') => {
  console.log(typeof chalk[type] === 'function' ? chalk[type](msg) : chalk.grey(msg));
};

/**
 * Colorful text 👐
 *
 * @param {string} msg
 * @param {string} type
 */
text = (msg, type = '') => {
  return typeof chalk[type] === 'function' ? chalk[type](msg) : chalk.grey(msg);
};

/**
 * Kill the process on error
 *
 * @param {string} msg
 */
die = (msg) => {
  log(`${text('ERROR:', 'bold')} ${msg}\n`, 'red');
  process.exit(1);
};

/**
 * Wrap for cmd text
 *
 * @param {string} msg
 */
cmdText = (msg) => {
  return `\`${chalk.italic.yellow(msg)}\``;
};

/**
 * Given a value, return the result as an array.
 *
 * @param {Any} v
 * @return {Array<Any>}
 */
arrayify = (v) => {
  return Array.isArray(v) ? v : [v];
}

module.exports = { arrayify, log, text, die, cmdText };
