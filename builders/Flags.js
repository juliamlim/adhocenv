class Flags {
  static get FLAG_MAP() {
    // @todo Turn this into a function that takes a parameter from an .env or config file that is an
    // object or string. If it's an object, use the object as the map, if it's a string - reqire('string')
    // to get contents of the file - eventually scale it to take the same props as vue

    return {
      // This must be either [major|minor|patch|revision] or #.#.#r#
      version: ['-v', '--version'],
      // Can either be [production|lower|gcp|local] default is lower
      environment: ['-e', '--env', '--environment'],
      //
    };
  }

  constructor(args = []) {
    let arg;
    return args.reduce((json, flag) => {
      const [, key, value] = flag.match(/^(--?[^=\s]*)=?(.*)/) || [, arg, flag];
      json[this.getFlagKey(key)] = value;

      /*
      Flag for alternative flag input (e.g. -f variable),
      stores flag with empty string then captures the flag name so the
      following variable will be stored under the previous flag attribute
      */
      arg = key;

      return json;
    }, {});
  }

  getFlagKey(flag) {
    return Object.keys(Flags.FLAG_MAP).find(key => Flags.FLAG_MAP[key].includes(flag));
  }
}

module.exports = Flags;
