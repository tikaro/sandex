class AddIndexToHours < ActiveRecord::Migration
  def change
    add_index(:hours, [:latitude, :longitude, :time], :unique => true)
  end
end
