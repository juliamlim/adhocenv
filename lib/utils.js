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
 * Kebab to Camel case
 *
 * @param {string} str  String to be converted
 *
 * @returns Camel case string
 */
kebabToCamel = (str) => {
  return typeof str === 'string' ? str.replace(/-([a-z])/g, g => g[1].toUpperCase()) : null;
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

module.exports = { arrayify, log, text, die, cmdText, kebabToCamel, parseString };
