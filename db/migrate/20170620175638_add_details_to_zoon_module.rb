class AddDetailsToZoonModule < ActiveRecord::Migration[5.0]
  def change
    add_column :zoon_modules, :details, :text, default: ""
  end
end
