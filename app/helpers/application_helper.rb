module ApplicationHelper
  def sandex_class(temperature, humidity)
    if temperature.between?(69,82) && humidity.between?(0.30,0.60)
      "sandex_true"
    else
      "sandex_false"
    end
  end

  def sandex_temperature_class(temperature)
    if temperature.between?(69,82)
      "sandex_temperature_true"
    else
      "sandex_temperature_false"
    end
  end

  def sandex_humidity_class(humidity)
    if humidity.between?(0.30,0.60)
      "sandex_humidity_true"
    else
      "sandex_humidity_false"
    end
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
