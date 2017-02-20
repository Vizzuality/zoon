class CreateFeedbacks < ActiveRecord::Migration[5.0]
  def change
    create_table :feedbacks do |t|
      t.references :feedbackable, polymorphic: true
      t.references :user, foreign_key: true
      t.integer :rating
      t.text :comment

      t.timestamps
    end

    add_index(
      :feedbacks,
      [
        :feedbackable_id,
        :feedbackable_type,
        :user_id,
      ],
      unique: true,
      name: 'feeback_by_user',
    )
  end
end
