module Sandex
  class HttpService #:nodoc:
    def initialize(http = Net::HTTP)
      @HTTP = http
    end

    def get_forecast(lat,lng)
      begin_time  = "2009-03-18T00:00:00"
      end_time    = "2009-03-19T00:00:00"
      LibXML::XML::Document.string(@HTTP.get(URI.parse("http://www.weather.gov/forecasts/xml/sample_products/browser_interface/ndfdXMLclient.php?&lat=#{lat}&lon=#{lng}1&product=time-series&begin=#{begin_time}&end=#{end_time}&rh=rh&temp=temp&wspd=wspd&icons=icons")))    
    end
 
  end
end
