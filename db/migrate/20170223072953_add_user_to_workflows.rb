class AddUserToWorkflows < ActiveRecord::Migration[5.0]
  def change
    add_reference :workflows, :user, foreign_key: true
  end
end
