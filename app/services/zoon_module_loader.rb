class ZoonModuleLoader
  def self.load_es contents
    self.import self.filter_modules_from_es_results(
      JSON.parse(contents),
    )
  end

  def self.filter_modules_from_es_results entries
    entries['hits']['hits'].
      select{|e| e['_type'] == 'module'}.
      map{|e| e['_source']}
  end

  def self.import json_entries
    tags = [
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

        m.tags = tags.sample 3
      end
    end
  end
end
