class AddUserIdToScreenshots < ActiveRecord::Migration[5.0]
  def change
    add_reference :screenshots, :user, foreign_key: true
  end
end
