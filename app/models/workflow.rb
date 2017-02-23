class Workflow < ApplicationRecord
  has_many :taggings, as: :taggable, dependent: :destroy
  has_many :tags, through: :taggings

  has_many(
    :workflow_modules,
    -> { order(:position) },
    inverse_of: :workflow,
    dependent: :destroy,
  )

  has_many :zoon_modules, through: :workflow_modules

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

  accepts_nested_attributes_for :workflow_modules

  FAMILIES = ["occurrence", "covariate", "process", "model", "output"]

    FAMILIES.each do |family|
    enum "#{family}_composition_type" => {
      list: 0,
      chain: 1,
    }, _suffix: true
  end

  def composition_types
    FAMILIES.map do |family|
      [family, send("#{family}_composition_type")]
    end.to_h
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
end
