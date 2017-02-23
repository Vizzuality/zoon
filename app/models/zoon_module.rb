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

  scope :search, -> (query, tags) {
    modules = query.split(/\s+/).reduce(left_outer_joins(:tags)) do |all, word|
      all.where(
        "zoon_modules.title ILIKE ? OR zoon_modules.description ILIKE ? OR tags.name = ?",
        "%#{word}%",
        "%#{word}%",
        word.downcase,
      )
    end

    if tags.empty?
      modules.distinct
    else
      modules.where("LOWER(tags.name) IN (?)", tags.map(&:downcase)).distinct
    end
  }

  scope :filter_by_family, -> (family) { where(family: family) }

  def author_emails
    (author || "").scan(/\\email{\s*([^}]*)\s*}/).map do |matches|
      matches.first.sub("@@", "@")
    end
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
    "https://github.com/zoonproject/modules/blob/master/R/#{name}"
  end

  def code
    name.split(".").first
  end
end
