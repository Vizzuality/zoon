class ZoonModule < ApplicationRecord
  validates :name, uniqueness: [:path]

  scope :search, -> (query) { where("UPPER(name) like UPPER(?) OR UPPER(description) like UPPER(?)", "#{query}%", "#{query}%") }
end
