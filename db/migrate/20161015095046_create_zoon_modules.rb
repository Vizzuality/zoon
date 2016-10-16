class CreateZoonModules < ActiveRecord::Migration[5.0]
  def change
    create_table :zoon_modules do |t|
      t.string :title
      t.text :description
      t.string :author
      t.string :name
      t.string :version
      t.date :date_submitted
      t.string :family
      t.string :path_to_module
      t.date :latest_import

      t.timestamps
    end
  end
end
