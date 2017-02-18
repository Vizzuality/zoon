class Screenshot < ApplicationRecord
  mount_uploader :image, ImageUploader

  belongs_to :screenshootable, polymorphic: true
end
