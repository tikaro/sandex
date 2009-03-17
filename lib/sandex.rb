require 'rubygems'
gem 'libxml-ruby', '>= 0.9.7'
gem 'andre-geokit', '>= 1.2.0'
gem 'outoftime-noaa', '>= 0.2.2'

require 'time'
require 'libxml'
require 'geokit'
require 'noaa'

%w(fanger_box http_service).each { |file| require File.join(File.dirname(__FILE__), 'sandex', file) }

module Sandex
    
  class <<self
    
    def initialize
      msg = ""
    end
    
    def forecast(lat='39.96',lng='-75.60')
      HttpService.new.get_forecast(lat,lng)
    end
    
    def calculate_for_station(station='KILG')
      conditions = NOAA.current_conditions_at_station(station)
      sandex_score = calculate(conditions.temperature, conditions.relative_humidity)
      sandex_score
    end
    
    def calculate(t,rh)
      
      # KCOS: Colorado Springs
      # KILG: West Chester
      # KNYC: Central Park
      
      puts "Conditions: #{t} degrees and #{rh}% relative humidity."
      
      
      sandex_score          = 100
      humidity_decrement    = 0
      temperature_decrement = 0

      humidity_penalty      = 2.5
      heat_penalty          = 2
      cold_penalty          = 1

      # Are we within the Fanger box?
      if FangerBox.acceptable?(t,rh)
        puts "Conditions are WITHIN the Fanger Box!\n"
      else
        
        puts "Those conditions are not inside the Fanger Box."
        
        # calculate the humidity decrement
        if FangerBox.too_dry?(rh)
            puts "* It's too dry.\n"
        elsif FangerBox.too_humid?(rh)
            humidity_delta = rh - FangerBox::HIGHEST_ALLOWABLE_HUMIDITY
            humidity_decrement = humidity_delta * humidity_penalty
            puts"* #{humidity_delta}% too humid. Subtracting #{humidity_decrement} points."
        else
            puts "* The humidity is within the box, but the temperature is outside it."
        end

        # calculate the temperature decrement
        if FangerBox.too_cold?(t,rh)
          cold_delta = FangerBox.minimum_temperature_at_humidity(rh) - t
          temperature_decrement = cold_delta * cold_penalty
          puts "* #{cold_delta} degrees too chilly. Subtracting #{temperature_decrement} points."
        elsif FangerBox.too_hot?(t,rh)
          heat_delta = t - FangerBox.maximum_temperature_at_humidity(rh)
          temperature_decrement = heat_delta * heat_penalty
          puts "* #{heat_delta} degrees too hot. Subtracting #{temperature_decrement} points."
        else
          puts "* Temperature is within the Fanger box, though the humidity is outside it."
        end
      
      end
      
      sandex_score -= humidity_decrement
      sandex_score -= temperature_decrement
      
      sandex_score
      
    end
  end
  
end