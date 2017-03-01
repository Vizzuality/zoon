# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version 2.3.1 (declared in both the Gemfile and .ruby-version)

* bundle && npm install

* Database: we're using PostgreSQL. Brew's default config will get you set.
Otherwise, you might want to change some params in `config/database.yml`.

* Import data from github:
Get a modules dump from the ES server. Then, run somerthing like `rails import:modules[path/to/modules.json]`.

You can also use `-` as the path to use stdin instead. For prod, you can do
something like `cat path/to/modules.json | heroku run rake rails import:modules[-]`

## Seeding
* `git checkout db/schema.rb; rake db:reset; rake db:migrate`
* Get a `modules.json` (from Pivotal Track, ES, etc)
* Run `rails import:modules[path/to/modules.json]`
