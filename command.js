module.exports = {
  commands: {
    deploy:  "./scripts/deploy.js",
    release: {
      description: "Creates an new release and auto assigns version",
      path: "./scripts/release.js"
    }
  },
  flags: {
    version: {
      alias: ["-v", "--version"],
      default: "patch",
      description: "Define the version for the deployment or release",
      transform: (value) => {
        return toString(value).toLowerCase();
      },
      validation: (value) => {
        return ['major', 'minor', 'patch', 'revision'].includes(value) || /\d.\d.\d-r\d/.test(value);
      },
    },
    environment: ["-e", "--env", "--environment"],
    branch: {
      alias: ["--branch", "-b"],
      description: "Branch to deploy to lower environment",
      commands: ["deploy"]
    }
  }
}
