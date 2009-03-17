module FangerBox
  
  LOWEST_ALLOWABLE_HUMIDITY  = 0
  HIGHEST_ALLOWABLE_HUMIDITY = 60
  
  def self.acceptable?(t,rh)
    # I tried writing this as A < B < C, but it didn't work.  Huh.
    rh <= HIGHEST_ALLOWABLE_HUMIDITY && t >= minimum_temperature_at_humidity(rh) && t <= maximum_temperature_at_humidity(rh)
  end
  
  def self.rh_acceptable?(rh)
    # A < B < C works here.
    LOWEST_ALLOWABLE_HUMIDITY < rh < HIGHEST_ALLOWABLE_HUMIDITY
  end
  
  def self.too_dry?(rh)
    # Fanger believed that humidity below 30% felt weird, but not uncomfortable.
    rh <= LOWEST_ALLOWABLE_HUMIDITY
  end
  
  def self.too_humid?(rh)
    # Fanger believed that humidity above 60% was pretty much always crappy.
    rh > HIGHEST_ALLOWABLE_HUMIDITY
  end
  
  def self.too_cold?(t,rh)
    t < minimum_temperature_at_humidity(rh)
  end
  
  def self.too_hot?(t,rh)
    t > maximum_temperature_at_humidity(rh)
  end
  
  def self.minimum_temperature_at_humidity(rh)
    # Based on the two bottom corners of the Fanger box:
    # * 69 degrees at 30% relative humidity
    # * 68 degrees at 60% relative humidity
    ((1/30) * rh ) + 70
  end
  
  def self.maximum_temperature_at_humidity(rh)
    # Based on the top two corners of the Fanger box:
    # * 82 degrees at 30% relative humidity
    # * 78 degrees at 60% relative humidity
    ((4/30) * rh ) + 86
  end
  


end