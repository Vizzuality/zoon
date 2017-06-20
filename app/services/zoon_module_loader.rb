class ZoonModuleLoader
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
        m.title = force_string(j, 'title')
        m.parameters = force_list(j, 'param')
        m.return_value = force_string(j, 'return')
        m.date_submitted = Date.parse extract_section(j, 'Date submitted')
        m.version = extract_section(j, 'Version')
        m.references = force_string(j, 'references')
        m.authors = make_authors(j)
        m.family = j['family']
        m.description = force_string(j, 'description')

        m.save!

        m.tags = tags.sample 3
      end
    end
  end

  def self.make_authors hash
    force_list(hash, "author").flat_map do |l|
      atoms = l.split(/, | & /) or []
      return [] if atoms.empty?

      email = /\\email\{([^}]*)\}/.match(atoms.last)&.[](1) and atoms.pop

      return {authorName: email, email: email} if atoms.empty?

      atoms.zip([email]).map{|(p, e)| {authorName: p, email: e}}
    end
  end

  def self.force_list hash, prefix
    hash.select do |k, _|
      k.start_with?("#{prefix}.") || k == prefix
    end.map do |(k, v)|
      parts = k.split(".", 2)
      [[parts[0], parts[1].to_i], v]
    end.sort.map(&:last)
  end

  def self.force_string hash, prefix
    force_list(hash, prefix).join("\n")
  end

  def self.extract_section hash, prefix, default=""
    canon = lambda{|l| l.strip.downcase}
    prefix_canon = canon.(prefix)

    force_list(hash, "section").map do |l|
      l.split(':')
    end.find([nil, default]) do |(header, _)|
      canon.(header) == prefix_canon
    end.last.strip
  end
end
