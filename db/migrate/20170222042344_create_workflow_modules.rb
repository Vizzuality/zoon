class CreateWorkflowModules < ActiveRecord::Migration[5.0]
  def change
    create_table :workflow_modules do |t|
      t.references :zoon_module, foreign_key: true
      t.references :workflow, foreign_key: true
      t.integer :position, null: false
    end
  end
end
