// Utils for scripts

const chalk = require('chalk');

/**
 * Quick log
 *
 * @param {string} msg
 * @param {string} type
 */
log = (msg, type = '') => {
  msg = arrayify(msg);
  msg.forEach((v) => console.log( typeof v === 'object' ? v : text(v, type)));
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
die = (...msg) => {
  log(`${text('ERROR:', 'bold')}`, 'red');
  msg.forEach(m => typeof m === 'string' ? log(`${m}`, 'red') : console.log(m) );
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

/**
 * Parses string and replaces placeholders with given values
 *
 * @param {string} file   A string with the file contents variables must be in {{ key }} format (spaces necessary)
 * @param {Object} data   Object containing values that will replace variables
 *
 * @returns {string} Returns fully replaced json
 */
parseString = (string, data) => {
  return string.replace(/{{\s(\S+)\s}}/g, (str, value) => data[value]);
}

module.exports = { arrayify, log, text, die, cmdText, parseString };
