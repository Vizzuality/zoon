class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable
  ratyrate_rater

  has_many :comments
end
