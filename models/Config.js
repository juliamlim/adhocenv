
export default class Config {
  constructor(
    flags = {},
    kubectl = {},
    branch = {},
  ) {
    this.root = path.dirname(require.main.filename),
    this.flags = flags;
    this.gcp = {
      kubectl,
    };
    this.git = { branch };
  }
};
