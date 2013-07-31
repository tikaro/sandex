module ApplicationHelper

  def sandex_class(temperature, humidity)
    if humidity.between?(0.3,0.6) && temperature.between?(temperature_lower_bound(humidity),temperature_upper_bound(humidity))
      "sandex_true"
    else
      "sandex_false"
    end
  end

  def temperature_lower_bound(humidity)
    (-3.3333333*humidity)+70
  end

  def temperature_upper_bound(humidity)
    (-13.3333333*humidity)+86
  end

  def forecast_time(forecast_time)
    day = Time.at(forecast_time).to_datetime.in_time_zone('Eastern Time (US & Canada)')
    time = Time.at(forecast_time).to_datetime.in_time_zone('Eastern Time (US & Canada)').strftime"%l%p"
    if day.to_date == Date.today
      "#{time} today"
    elsif day.to_date == DateTime.now.to_date.tomorrow
      "#{time} tomorrow"
    else
      "#{time} #{day.strftime"%A"}"
    end
  end
end
