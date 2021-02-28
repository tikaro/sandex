# Sandex

_"Will the weather be perfect anytime in the next couple of days?"_

The Sandex is the index of how the weather in West Chester, PA compares to the theoretically-perfect weather in San Diego, California in the next couple of days.

[![Netlify Status](https://api.netlify.com/api/v1/badges/2b0386c1-28fc-4dc3-bccc-50578e189008/deploy-status)](https://app.netlify.com/sites/sandex/deploys)

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

## Now it is a React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## It is Deployed via Netlify

Every push to the `main` branch results in a Netlify deployment to https://sandex.netlify.app 

If you have access to John's Netlify team, you can access the Netlify build at [app.netlify.com/sites/sandex](https://app.netlify.com/sites/sandex/overview)

### Local Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
