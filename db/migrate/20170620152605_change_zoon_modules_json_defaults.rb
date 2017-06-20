class ChangeZoonModulesJsonDefaults < ActiveRecord::Migration[5.0]
  def change
    change_column_default(:zoon_modules, :authors, from: {}, to: [])
    change_column_default(:zoon_modules, :parameters, from: {}, to: [])
  end
end
