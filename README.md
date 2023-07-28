# Sandex

_"Will the weather be perfect anytime in the next couple of days?"_

The Sandex is the index of how the weather in ~West Chester, PA~ Belfast, Maine (temporarily) compares to the theoretically-perfect weather in San Diego, California in the next couple of days.

## Background

"Room Temperature" was invented by professor Ole Fanger. [Here's a PDF link](http://ceae.colorado.edu/~brandem/aren3050/docs/ThermalComfort.pdf) where you can read about it.

This site checks the hourly weather coming up, and sees whether the bounds of temperature and humidity match the parameters for perfect thermal comfort.  

By oversimplifying Ole Fanger's rubric, the Sandex deems that the weather outside is perfect when:

* The temperature is between 68 degrees and 76 degrees Fahrenheit, _AND_
* The relative humidity is between 30 and 60%.

The box is not square; at 76 degrees, the relative humidity must be lower in order to be perfectly comfortable.

## This used to be a Rails app

There used to be a site at `sandex.me` which used Rails to display a Sandex chart coming up.  That site was powered by the DarkSky API.  The DarkSky API went away, and these days a full Rails site running on Heroku is overpowered for this application, so John recreated the Sandex site in React, using forecast data from [Tomorrow.io](https://tomorrow.io).

Feel free to contact John with any questions or ridicule at `john.young@gmail.com`

## Now it is a React App

This project was bootstrapped first with [Create React App](https://github.com/facebook/create-react-app), and then a second time with [Vite](https://vitejs.dev/).

## It uses Github Actions to fetch the forecast

Every day, a [Github action](https://github.com/tikaro/sandex/actions/runs/5163534089/workflow) fetches the forecast as a blob of JSON from tomorrow.io and commits that blob to the repository.  So there's no API call for the user; it's an API stub that happens to be updated every day.

## It is Deployed via Vercel

Every push to the `main` branch results in a Vercel deployment to https://sandex.me

### Local Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches a [vitest](https://vitest.dev/) test runner and runs test.

#### `yarn build`

Builds the app for production to the `dist` folder.\

See the section about [deployment](https://vitejs.dev/guide/static-deploy.html) for more information.
