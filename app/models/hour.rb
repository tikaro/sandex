class Hour < ActiveRecord::Base
  default_scope order('time ASC')
  
  attr_accessible :humidity, :latitude, :longitude, :temperature, :time

  validates_uniqueness_of :time, scope: [:latitude, :longitude]

end
