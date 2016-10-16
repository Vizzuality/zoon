class ZoonModule < ApplicationRecord
  validates :name, uniqueness: [:path]
end
