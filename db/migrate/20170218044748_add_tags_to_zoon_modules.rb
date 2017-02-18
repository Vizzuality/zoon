class AddTagsToZoonModules < ActiveRecord::Migration[5.0]
  def change
    add_column :zoon_modules, :tags, :string, array: true, default: []
  end
end
