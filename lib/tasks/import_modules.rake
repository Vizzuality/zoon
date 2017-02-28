require "date"

namespace :import do

  desc "Imports modules information from an ES dump"
  task :modules, [:filename] => [:environment] do |t, args|
    if not args[:filename]
      raise "I need a filename (or - for stdin). Try something like " +
      "rake import:modules[modules.json]"
    end

    TAGS = [
      Tag.find_or_create_by!(name: "europe"),
      Tag.find_or_create_by!(name: "portugal"),
      Tag.find_or_create_by!(name: "north america"),
      Tag.find_or_create_by!(name: "africa"),
      Tag.find_or_create_by!(name: "usa"),
      Tag.find_or_create_by!(name: "sudan"),
      Tag.find_or_create_by!(name: "pakistan"),
      Tag.find_or_create_by!(name: "australia"),
      Tag.find_or_create_by!(name: "thailand"),
      Tag.find_or_create_by!(name: "russia"),
    ]

    if args[:filename] == '-'
      contents = STDIN.read
    else
      contents = File.read(args[:filename])
    end

    json_entries = JSON.parse(contents)['hits']['hits'].
      select{|e| e['_type'] == 'module'}.
      map{|e| e['_source']}

    puts "Loaded #{json_entries.length} entries from the JSON input"
    puts "Started with #{ZoonModule.count} visible in the DB"

    ActiveRecord::Base.transaction do
      modules = Hash[
        ZoonModule.unscoped.all.map do |m|
          m.visible = false
          m.save!
          [m.name, m]
        end
      ]

      json_entries.each do |j|
        name = j['name']
        modules[name] = m = modules[name] || ZoonModule.new(name: name)

        m.visible = true
        m.latest_import = DateTime.now
        m.title = m.name
        m.parameters = j['parameters']
        m.return_value = j['returnValues'].join '\n'
        m.date_submitted = Date.parse j['submitted']
        m.version = j['version']
        m.references = j['references']
        m.location = j['location']
        m.authors = j['authors']
        m.family = j['type']
        m.description = j['descriptions'].join '\n'

        m.save!

        m.tags = TAGS.sample 3
      end
    end

    puts "Ended with #{ZoonModule.count} visible in the DB"
  end
end
