# Energy Meter Readings Koa Rest API Kata

## Overview

A coding exercise that involves creating a Koa server REST API built with Node, Koa and TypeScript. Tested with Jest and Supertest.

For this project I did a few things:
1.  Developed a meter readings API.
2.  Changed how monthly usage is calculated and exposed this via an endpoint in the REST API.

## Tasks

### Created a meter reading API

For this task, I created a new REST API for meter readings, in `service/`.

There is a very basic [Koa server](https://koajs.com/) in the `service/` directory, with a [Koa router](https://github.com/alexmingoia/koa-router). There is also a simple database set up in `service/data.js` that used to store data for this task.

This is a simple RESTful API that can:

* retrieve a list of meter readings from the database,
* add a new meter reading that gets stored in the database,

I took this as an opportunity to write appropriate tests. I like to use Jest and the tests can be run via `yarn test`.

### Changed how monthly usage is calculated

For this task, I calculated the monthly estimated electricity usage in the REST Koa API and is exposed via a GET endpoint.

This API now has the ability to:

1.  Estimate the end of month meter readings (by interpolating the closest meter readings, i.e. the ones available just before and just after),
2.  Calculate the energy usage for the month based on the estimated end of month meter readings,

The usage data is then be exposed via an API endpoint that a web application could receive. It outputs each month, and the estimated usage within that month. This uses the data that is seeded in the database.

**Assumptions**

* I assumed there was exactly one meter reading per month.
* The table should still reflected the pre-existed readings.
* I didn't try to interpolate at the edges of the dataset (i.e. if I didn't have a meter reading for month M-1, then I didn't try to estimate the meter reading for month M),
* `EnergyUsage(month M) = MeterReading(last day of month M) - MeterReading(last day of month M-1)`,
* To deal with dates I used [momentjs](https://momentjs.com).

## Setup

This app is written in TypeScript. The project is set up with the required build commands and uses loose compiler settings.

### Dependencies

The main dependencies are listed below.

* [Koa](https://koajs.com/) as the server framework,
* [Koa Router](https://github.com/alexmingoia/koa-router) for routing,
* [Jest](https://jestjs.io/) as the test framework,

I used [yarn](https://yarnpkg.com/lang/en/docs/install/) to manage dependencies and ran this in node 8.9.x.

## Commands

* `yarn install` - install all dependencies
* `yarn build` - compile the TypeScript to JavaScript
* `yarn start` - compile and run the web server, watching for updates and restarting as required
* `yarn serve` - start the web server using the compiled JS. The code must be compiled first. Useful for running in production.
* `yarn test` - run all unit tests

If you get a port conflict when running the server use the `PORT` environment variable to change it, e.g. `PORT=3001 yarn start` or in Windows:

```
set PORT=3001
yarn start
```
