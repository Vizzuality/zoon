class ZoonModule < ApplicationRecord
  has_many :taggings, as: :taggable, dependent: :destroy
  has_many :tags, through: :taggings

  has_many :screenshots, as: :screenshootable, dependent: :destroy

  has_many :feedbacks,
    -> {
      order('updated_at DESC').extending(Feedback::Upserter)
    },
    as: :feedbackable,
    dependent: :destroy

  has_many :comments,
    -> { comments },
    as: :feedbackable,
    class_name: 'Feedback'

  validates :name, uniqueness: [:path]

  default_scope { where(visible: true) }

  scope :search, -> (query, tags) {
    modules = query.split(/\s+/).reduce(left_outer_joins(:tags)) do |all, word|
      all.where(
        "zoon_modules.name ILIKE ? OR zoon_modules.description ILIKE ? OR tags.name = ?",
        "%#{word}%",
        "%#{word}%",
        word.downcase,
      )
    end

    if not tags.empty?
      modules = modules.where("LOWER(tags.name) IN (?)", tags.map(&:downcase))
    end

    modules.
      select('distinct on (zoon_modules.name) zoon_modules.*').
      reorder('zoon_modules.name')
  }

  scope :filter_by_family, -> (family) { where(family: family) }

  def author_emails
    authors.map{|v| v['email']}
  end

  def average_rating
    feedbacks.average(:rating).to_f
  end

  def rating_count
    feedbacks.count
  end

  def comment_count
    feedbacks.comments.count
  end

  def url
    "https://github.com/zoonproject/modules/blob/master/R/#{name}.R"
  end

  def code
    name
  end
end
