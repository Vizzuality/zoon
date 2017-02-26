class AddEsFields < ActiveRecord::Migration[5.0]
  def up
    change_table :zoon_modules do |t|
      t.remove :path_to_module
      t.remove :author

      t.json :authors, null: false, default: {}
      t.json :parameters, null: false, default: {}
      t.string :location
      t.text :references
      t.text :return_value
      t.boolean :visible, null: false, default: true

      t.change :latest_import, :datetime, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.change :name, :string, null: false
    end
  end
end
