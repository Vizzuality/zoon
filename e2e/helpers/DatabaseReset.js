class DatabaseReset extends Helper {
  _before() {
    this.helpers['ExternalCommand'].run(['rake', 'db:reseed'], {
      RAILS_ENV: "test"
    })
  }
}

module.exports = DatabaseReset;
