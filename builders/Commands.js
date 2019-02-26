const Flags = require('./flags');

class Command {
  constructor(args = {
    commands: [],
    flags: {}
  }) {

    this.flags = new Flags(args.flags, process.argv.slice(2));
  }
}

module.exports = Command;
