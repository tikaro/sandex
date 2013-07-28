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
end
