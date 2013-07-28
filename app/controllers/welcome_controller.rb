class WelcomeController < ApplicationController
  def index
    my_latitude = 39.9893
    my_longitude = -75.6120

    @forecast = ForecastIO.forecast(my_latitude, my_longitude, params: {exclude: "minutely,daily,alerts,flags"} )

    @current_temp      = @forecast.currently.temperature.round
    @current_humidity  = (100*(@forecast.currently.humidity)).round

    @hours = @forecast.hourly.data

    #forecast.hourly.data.each do |hour|
    #  forecast_time = Time.at(hour.time).to_datetime.strftime"%A %l%p"
    #  forecast_temperature = hour.temperature.round
    #  forecast_humidity = (100*(hour.humidity)).round
    #  if forecast_temperature.between?(69,82) && forecast_humidity.between?(30,60)
    ##    puts "============ Sandex 100% ================"
     # end
     # puts "#{forecast_time}: #{forecast_temperature.round}°F, #{forecast_humidity}% humidity."
    #end

    

  end
end
