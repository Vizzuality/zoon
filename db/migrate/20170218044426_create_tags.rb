class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.string :name

      t.timestamps
    end

    create_table :taggings do |t|
      t.references :tag
      t.references :taggable
      t.string :taggable_type

      t.timestamps
    end
  end
end
