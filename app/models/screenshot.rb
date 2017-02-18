class Screenshot < ApplicationRecord
  mount_uploader :image, ImageUploader

  validates :image, presence: true

  belongs_to :screenshootable, polymorphic: true
end
