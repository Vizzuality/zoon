class Workflow < ApplicationRecord
  has_many :workflow_modules, -> { order(:position) }, inverse_of: :workflow
  has_many :zoon_modules, through: :workflow_modules

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
end
