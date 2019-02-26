class Flags {
  static get FLAG_MAP() {
    // @todo Turn this into a function that takes a parameter from an .env or config file that is an
    // object or string. If it's an object, use the object as the map, if it's a string - reqire('string')
    // to get contents of the file - eventually scale it to take the same props as vue

    return {
      // Can either be [production|lower|gcp|local] default is lower
      environment: ['-e', '--env', '--environment'],
      // This must be either [major|minor|patch|revision] or #.#.#r#
      version: {
        alias: ['-v', '--version'],
        default: 'patch',
        description: 'Define the version for the deployment or release',
        transform: (value) => {
          return toString(value).toLowerCase();
        },
        validation: (value) => {
          return ['major', 'minor', 'patch', 'revision'].includes(value) || /\d.\d.\d-r\d/.test(value);
        },
      }
    };
  }

  constructor(map, args = []) {
    let arg;
    return args.reduce((json, input) => {
      const [, flag, value] = input.match(/^(--?[^=\s]*)=?(.*)/) || [, arg, input];
      const key = this.getFlagKey(flag);

      if ('validation' in Flags.FLAG_MAP[key]) {
        if (!Flags.FLAG_MAP[key].validation(value)) throw new Error(`Input for: ${key}, does not meet validation criteria.`);
      }

      json[key] = 'transform' in Flags.FLAG_MAP[key] ? Flags.FLAG_MAP[key].transform(value) : value;

      /*
      Flag for alternative flag input (e.g. -f variable),
      stores flag with empty string then captures the flag name so the
      following variable will be stored under the previous flag attribute
      */
      arg = flag;

      return json;
    }, {});
  }

  getFlagKey(flag) {
    return Object.keys(Flags.FLAG_MAP).find(key => 'alias' in Flags.FLAG_MAP[key]
      ? Flags.FLAG_MAP[key].alias.includes(flag)
      : Flags.FLAG_MAP[key].includes(flag));
  }
}

module.exports = Flags;
