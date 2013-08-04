START_DATE = Date.new(2012,8,1)
END_DATE   = Date.new(2013,8,3)
LATITUDE   = 39.9606
LONGITUDE  = -75.6058

desc "Get hourly forecast history"
task :history => :environment do

  @start_date = START_DATE
  @end_date   = END_DATE

  @start_date.upto(@end_date) do |day|
    forecast_time = day.to_time.to_i
    
    puts "Getting forecast for #{day.to_time.iso8601}: #{forecast_time}"
    
    forecast = ForecastIO.forecast(LATITUDE, LONGITUDE, { time: forecast_time } )
    hours = forecast.hourly.data

    hours.each do |forecast_hour|
      puts forecast_hour.time
      puts forecast_hour.temperature
      puts forecast_hour.humidity

      h = Hour.new( latitude: LATITUDE, 
                    longitude: LONGITUDE,
                    time: forecast_hour.time,
                    temperature: forecast_hour.temperature,
                    humidity: forecast_hour.humidity )
      if h.save
        puts "hour CREATED"
      else
        puts "hour at time #{forecast_hour.time} not created because #{h.errors.messages}"
      end

      puts "---"
    end

    sleep(3)


  end
end
