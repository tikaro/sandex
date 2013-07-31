class WelcomeController < ApplicationController
  def index
    
    @location = params[:loc]  ||= "West Chester, PA"
    latitude = params[:lat]   ||= 39.9606
    longitude = params[:lon]  ||= -75.6058

    @forecast = ForecastIO.forecast(latitude, longitude, params: {exclude: "minutely,daily,alerts,flags"} )

    @current_temp      = @forecast.currently.temperature.round
    @current_humidity  = (100*(@forecast.currently.humidity)).round

    @hours = @forecast.hourly.data

  end
end
