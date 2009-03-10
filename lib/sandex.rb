require 'rubygems'
gem 'libxml-ruby', '>= 0.9.7'
gem 'andre-geokit', '>= 1.2.0'
gem 'outoftime-noaa', '>= 0.2.2'

require 'time'
require 'libxml'
require 'geokit'
require 'noaa'

module Sandex
  def self.calculate(local_station='KILG')
    local_conditions = NOAA.current_conditions_at_station(local_station)
    ksan_conditions  = NOAA.current_conditions_at_station('KSAN')
    
    local_temperature = local_conditions.temperature
    ksan_temperature  = ksan_conditions.temperature
    
    temperature_delta = ( ksan_temperature - local_temperature ).abs
    
    sandex_score = ( 100 - temperature_delta.to_f ) / 100
    
    sandex_score
  end
end