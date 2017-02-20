class RemoveRatyrate < ActiveRecord::Migration[5.0]
  def change
    drop_table :overall_averages
    drop_table :average_caches
    drop_table :rates
    drop_table :rating_caches
  end
end
