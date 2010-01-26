require 'rubygems'
gem 'libxml-ruby', '>= 0.9.7'

require 'time'
require 'libxml'
require 'net/http'

%w(fanger_box).each { |file| require File.join(File.dirname(__FILE__), 'sandex', file) }

module Sandex
    
  class <<self
    
    def initialize
      msg = ""
    end
    
    def calculate(t,rh)
      
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
  
  class Location
    
    def initialize(lat,lng,station_name = nil)
      @lat, @lng    = lat, lng
      @station_name = station_name
    end
    
    attr_reader :lat, :lng, :station_name
    
    def day_for(date)
      Day.new(date,self)
    end
    
    def today
      day_for(Date.today)
    end
    
    def tomorrow
      day_for(Date.today + 1)
    end
    
  end
  
  class Day
    
    def initialize(date,location)
      @date = date
      @location = location
    end
    
    attr_reader :date, :location, :forecasts
    
    def inspect 
      "#{self.class.name} Date: #{date} Location: #{location.station_name}"
    end
    
    def data_url
      #time format that weather.gov expects to see is "2009-03-18T00:00:00"
      begin_time  = Time.local(date.year,date.month,date.day).strftime("%Y-%m-%dT%H:%M:%S")
      end_time    = Time.local(date.year,date.month,date.day,23,59,59).strftime("%Y-%m-%dT%H:%M:%S")
      "http://www.weather.gov/forecasts/xml/SOAP_server/ndfdXMLclient.php?whichClient=NDFDgen&lat=39.96&lon=-75.60&product=time-series&begin=#{begin_time}&end=#{end_time}&temp=temp&rh=rh"
    end
    
    def data!
      LibXML::XML::Document.string(Net::HTTP.get(URI.parse(data_url)))
    end
    
    def data
      @data ||= data!
      time  = @data.find_first(%q{/dwml/data/time-layout/start-valid-time/text()}).to_s
      temp  = @data.find_first(%q{/dwml/data/parameters/temperature/value/text()}).to_s
      rh    = @data.find_first(%q{/dwml/data/parameters/humidity/value/text()}).to_s
      [
        {:time => time, :temp => temp.to_i, :rh => rh.to_i},
      #  {:time => time, :rh => rh, :temp => temp},
      #  {:time => time, :rh => rh, :temp => temp}
      ]
    end
    
    def forecasts
      @forecasts ||= data.map do |y|
        Forecast.new(self, y[:time], y[:temp], y[:rh])
      end
    end
    
  end
  
  class Forecast
    def initialize(day, time, rh, temp)
      @day, @time, @rh, @temp = day, time, temp, rh
    end
    
    attr_reader :day, :time, :temp, :rh, :sandex_score
    
    def sandex_score
      Sandex.calculate(temp, rh)
    end
    
  end
  
end

def kilgtmw
  include Sandex
  l = Location.new(39.90,-75.01,'kilg')
  d = l.tomorrow
  f = d.forecasts.first
end
  