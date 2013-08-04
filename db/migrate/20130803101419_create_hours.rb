class CreateHours < ActiveRecord::Migration
  def change
    create_table :hours do |t|
      t.float :latitude
      t.float :longitude
      t.integer :time
      t.float :temperature
      t.float :humidity

      t.timestamps
    end
  end
end
