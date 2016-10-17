class Comment < ApplicationRecord
  belongs_to :zoon_module
  belongs_to :user
end
