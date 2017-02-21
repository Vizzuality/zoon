class ZoonModule < ApplicationRecord
  has_many :taggings, as: :taggable, dependent: :destroy
  has_many :tags, through: :taggings

  has_many :screenshots, as: :screenshootable, dependent: :destroy

  validates :name, uniqueness: [:path]

  scope :search, -> (query, tags) {
    modules = query.split(/\s+/).reduce(left_outer_joins(:tags)) do |all, query|
      all.where(
        "zoon_modules.title ILIKE ? OR zoon_modules.description ILIKE ? OR tags.name = ?",
        "%#{query}%",
        "%#{query}%",
        query.downcase,
      )
    end

    if tags.empty?
      modules.uniq
    else
      modules.where(tags: { name: tags.map(&:downcase) }).uniq
    end
  }
  scope :filter_by_family, -> (family) { where(family: family) }
end
