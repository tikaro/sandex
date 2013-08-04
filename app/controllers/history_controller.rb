class HistoryController < ApplicationController
  def index

    @location = params[:loc]  ||= "West Chester, PA"
    latitude = params[:lat]   ||= 39.9606
    longitude = params[:lon]  ||= -75.6058

    @hours = Hour.all

  end
end
