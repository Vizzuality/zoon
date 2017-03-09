'use strict'

const {spawn} = require('child_process')

var server;

module.exports = {
  bootstrap: function(done) {
    console.log("Booting Rails");

    server = spawn('rails', ['s'], {
      env: Object.assign(
        {RAILS_ENV: "test"},
        process.env
      )
    })

    server.stdout.on('data', (data) => {
      const line = data.toString().trim()
      if (line === "Use Ctrl-C to stop") {
        done();
      }
      console.log(`Rails stdout: ${line}`);
    });

    server.stderr.on('data', (data) => {
      const line = data.toString().trim()
      console.log(`Rails stderr: ${line}`);
    });

    server.on('close', (code) => {
      console.log(`Rails process exited with code ${code}`);
    });
  },
  teardown: function(done) {
    const t = setTimeout(
      () => server.kill('SIGKILL'),
      5000
    )
    server.on('close', (code) => {
      clearTimeout(t)
      done();
    });
    server.kill();
  }
}
