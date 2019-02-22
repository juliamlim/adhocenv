class Help {
  constructor(config = {}) {
    this.commands = config.commands || {};
    this.flags = config.flags || {};
  }

  commandBody() {
    // @todo Localize text
    return `Commands:
    ${
      Object.keys(this.commands).map(c => {
        const cmd = this.commands[c] || {};
        // return 'description' in cmd ? `${c}: ${cmd.description}\n` : `${c}\n`;
      })
    }`;
  }

  flagBody() {

  }
}

module.exports = Help;
