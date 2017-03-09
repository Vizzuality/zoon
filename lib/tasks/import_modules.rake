require "date"

namespace :import do

  desc "Imports modules information from an ES dump"
  task :modules, [:filename] => [:environment] do |t, args|
    if not args[:filename]
      raise "I need a filename (or - for stdin). Try something like " +
      "rake import:modules[modules.json]"
    end

    if args[:filename] == '-'
      contents = STDIN.read
    else
      contents = File.read(args[:filename])
    end

    json_entries = ZoonModuleLoader.filter_modules_from_es_results(
      JSON.parse(contents),
    )

    puts "Loaded #{json_entries.length} entries from the JSON input"
    puts "Started with #{ZoonModule.count} visible in the DB"

    ZoonModuleLoader.import json_entries

    puts "Ended with #{ZoonModule.count} visible in the DB"
  end
end
