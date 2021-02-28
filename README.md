# Sandex

_"Will the weather be perfect anytime in the next couple of days?"_

The Sandex is the index of how the weather in West Chester, PA compares to the theoretically-perfect weather in San Diego, California in the next couple of days.

## Background

"Room Temperature" was invented by professor Ole Fanger. [Here's a PDF link](http://ceae.colorado.edu/~brandem/aren3050/docs/ThermalComfort.pdf) where you can read about it.

This site checks the hourly weather coming up, and sees whether the bounds of temperature and humidity match the parameters for perfect thermal comfort.  

In practice, the weather outside is perfect when:

* The temperature is between 68 degrees and 76 degrees Fahrenheit, _AND_
* The relative humidity is between 30 and 60%.

The box is not square; at 76 degrees, the relative humidity must be lower in order to be perfectly comfortable.

## This used to be a Rails app

There used to be a site at `sandex.me` which used Rails to display a Sandex chart coming up.  That site was powered by the DarkSky API.  The DarkSky API is going away, and these days a full Rails site running on Heroku is overpowered for this application, so John is recreating the Sandex site in React, using another weather API provider to be selected.

Feel free to contact John with any questions or ridicule at `john.young@gmail.com`