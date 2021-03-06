# Eventus Web Application
The Eventus web application uses Angular 2 and Bootstrap 3

## Prerequisites
The latest versions of Node.js and npm are required to run the project.

Download the latest versions of Node.js and npm [here](https://nodejs.org/en/download/current/)

As of this writing, we're using `node v7.6.0` and `npm v4.1.2`. To check for yourself, use `node -v` and `npm -v`.

## Getting Started
Install all npm dependencies by running
```bash
npm install
```

Then just running Eventus locally is as simple as
```bash
npm run start:dev
```

## Running Tests
Running tests is just as simple
```bash
npm test
```

## Deploying the application
Eventus-Web is hosted on Heroku. To deploy, commit your code to master and enter
```bash
git push heroku master
```
Then simply enter
```bash
heroku open
```
To open the website