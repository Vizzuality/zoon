class CreateScreenshots < ActiveRecord::Migration[5.0]
  def change
    create_table :screenshots do |t|
      t.references :screenshootable
      t.string :screenshootable_type

      t.timestamps
    end
  end
end
