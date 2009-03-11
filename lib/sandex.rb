require 'rubygems'
gem 'libxml-ruby', '>= 0.9.7'
gem 'andre-geokit', '>= 1.2.0'
gem 'outoftime-noaa', '>= 0.2.2'

require 'time'
require 'libxml'
require 'geokit'
require 'noaa'

%w(fanger_box).each { |file| require File.join(File.dirname(__FILE__), 'sandex', file) }

module Sandex
    
    def self.calculate(station='KILG', verbose=nil)
      
      # KCOS: Colorado Springs
      # KILG: West Chester
      # KNYC: Central Park
      
      sandex_score          = 100
      humidity_decrement    = 0
      temperature_decrement = 0
      msg = ""

      humidity_penalty      = 2.5
      heat_penalty          = 2
      cold_penalty          = 1

      current_conditions = NOAA.current_conditions_at_station(station)
      t  = current_conditions.temperature
      rh = current_conditions.relative_humidity
      
      msg += "At station #{station}, it's currently #{t} degrees and #{rh}% humidity.\n\n"

      # Are we within the Fanger box?
      if FangerBox.acceptable?(t,rh)
        msg += "Conditions are WITHIN the Fanger Box!\n"
      else
        
        msg += "Sadly, conditions are not inside the Fanger Box:\n"
        
        # calculate the humidity decrement
        if FangerBox.too_dry?(rh)
            msg += "* It's too dry.\n"
        elsif FangerBox.too_humid?(rh)
            humidity_delta = rh - FangerBox::HIGHEST_ALLOWABLE_HUMIDITY
            humidity_decrement = humidity_delta * humidity_penalty
            msg += "* It's too humid: (#{humidity_delta}% outside the Fanger Box)\n"
            msg += "  Decrement: #{humidity_penalty} Sandex points for each percent of humidity.\n"
            msg += "  Subtracting #{humidity_decrement} points from the Sandex.\n"
        else
            msg += "* The humidity is within the box, but the temperature is outside it.\n"
        end

        # calculate the temperature decrement
        if FangerBox.too_cold?(t,rh)
          cold_delta = FangerBox.minimum_temperature_at_humidity(rh) - t
          temperature_decrement = cold_delta * cold_penalty
          msg += "* It's #{cold_delta} degrees too chilly for the Fanger Box.\n"
          msg += "  Decrement: #{cold_penalty} Sandex points for each degree too cold.\n"
          msg += "  Subtracting #{temperature_decrement} points from the Sandex.\n"
        elsif FangerBox.too_hot?(t,rh)
          heat_delta = t - FangerBox.maximum_temperature_at_humidity(rh)
          temperature_decrement = heat_delta * heat_penalty
          msg += "* It's #{heat_delta} degrees too hot for the Fanger Box.\n"
          msg += "  Decrement: #{heat_penalty} Sandex points for each degree too hot.\n"
          msg += "  Subtracting #{temperature_decrement} points from the Sandex.\n"
        else
          msg += "* Temperature is within the Fanger box, though the humidity is outside it."
        end
      
      end
      
      sandex_score -= humidity_decrement
      sandex_score -= temperature_decrement

      msg += "\nThe Sandex score for station #{station} is #{sandex_score}.\n"
    
      puts msg if verbose == "verbose"
      
      sandex_score
      
    end
  
end