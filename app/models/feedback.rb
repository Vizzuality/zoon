class Feedback < ApplicationRecord
  belongs_to :feedbackable, polymorphic: true

  module Upserter
    def upsert user_id, rating, comment=''
      f = find_or_initialize_by(user_id: user_id)
      f.rating = rating
      f.comment = comment
      f.save!
      return f
    end
  end

  belongs_to :user

  scope :comments, ->{where("comment <> ''")}
end
