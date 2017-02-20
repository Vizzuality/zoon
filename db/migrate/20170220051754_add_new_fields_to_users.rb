class AddNewFieldsToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :organization, :string
    add_column :users, :github_username, :string
    add_column :users, :name, :string
  end
end
