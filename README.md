# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you'll need to cover:

* Ruby version (declared in both the Gemfile and .ruby-version)

* bundle && yarn (ReactOnRails will use npm, but prefer yarn otherwise)

* PostgreSQL: Brew's default config will get you set (i.e., have a pg user that
  has the same name as your unix user and is passwordless). Otherwise, you might
  want to change some params in `config/database.yml`.

* Set the DB to a known state. `git checkout db/schema.rb; rake db:reset`

* Do things with `foreman start -f Procfile.dev`

