const {spawnSync} = require('child_process')

class ExternalCommand extends Helper {
  run (args, env = {}) {
    this.debug(`Executing ${args.join(' ')}`)
    const name = args[0]
    const p = spawnSync(
      name,
      args.slice(1),
      {env: Object.assign({}, env, process.env)}
    )
    this.debug(`${name} stdout: ${p.stdout}`);
    this.debug(`${name} stderr: ${p.stderr}`);
    this.debug(`${name} process exited with code ${p.status}`);
  }
}

module.exports = ExternalCommand;
