class AddCompositionTypesToWorkflows < ActiveRecord::Migration[5.0]
  def change
    ["occurrence", "covariate", "process", "model", "output"].each do |family|
      add_column :workflows, "#{family}_composition_type", :integer, default: 0
    end
  end
end
