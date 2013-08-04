module ApplicationHelper

  def sandex_class(temperature, humidity)
    return if humidity.blank? || temperature.blank?
    "sandex_true" if humidity.between?(0.3,0.6) && temperature.between?(temperature_lower_bound(humidity),temperature_upper_bound(humidity))
  end

  def sandex_classes(temperature, humidity)
    return if humidity.blank? || temperature.blank?
    classes = []
    classes << "too_cold" if temperature < temperature_lower_bound(humidity)
    classes << "too_hot" if temperature > temperature_upper_bound(humidity)
    classes << "too_dry" if humidity < (0.3)
    classes << "too_wet" if humidity > (0.6)
    classes << "sandex_true" if humidity.between?(0.3,0.6) && temperature.between?(temperature_lower_bound(humidity),temperature_upper_bound(humidity))
    classes.join(' ')
  end

  def temperature_lower_bound(humidity)
    (-3.3333333*humidity)+70
  end

  def temperature_upper_bound(humidity)
    (-13.3333333*humidity)+86
  end

  def short_time(forecast_time)
    day = Time.at(forecast_time).to_datetime.in_time_zone('Eastern Time (US & Canada)')
    time = Time.at(forecast_time).to_datetime.in_time_zone('Eastern Time (US & Canada)').strftime"%l%p"
    if day.to_date == DateTime.now.in_time_zone('Eastern Time (US & Canada)').to_date
      "#{time} today"
    elsif day.to_date == DateTime.now.in_time_zone('Eastern Time (US & Canada)').to_date.tomorrow
      "#{time} tomorrow"
    else
      "#{time} #{day.strftime"%A"}"
    end
  end

  def long_time(forecast_time)
    Time.at(forecast_time).to_datetime.strftime("%a, %e %b %Y %H:%M:%S %z")
  end

  def short_hour(forecast_time)
    Time.at(forecast_time).to_datetime.strftime("%l")
  end
end
