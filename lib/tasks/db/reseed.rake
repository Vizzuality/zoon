namespace :db do
  desc "Truncate all existing data, and loads the seed data"
  task :reseed => ["db:environment:set", "db:check_protected_environments"] do
    DatabaseCleaner.clean_with :truncation
    Rake::Task["db:seed"].execute
  end
end
