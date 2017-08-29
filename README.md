# Telescope
In this repository we try to build a Multimedia Tiketing systemthat can take sounds, pictures, videos, logs etc.  for the smart machines  and put them together with the ticket. The another important feature of this application
is that it links the sensors data from the Predix TimeSeries with the ticket for the timeperiod mention in the ticket.
It is a unique way of labeling the unlabeled sensor data.

## Running locally
1. Edit the config.json to run the application locally for your UAA client.
2. Change the mongodb host to localhost


#### Install and start local web server
```
npm install
node index.js or npm start
```
Navigate to <http://localhost:8080> in your web browser.

## Running in docker Container
1. Install the docker-compose and docker
2. Update mongodb host in the config file to "mongodbinst"
#### start
```
docker-compose up
```

Navigate to <http://localhost:8080> in your web browser.

#### Install and start local web server
```
npm install
node index.js or npm start
```
Na

## Running in the cloud

Set up the manifest file for Cloud deployment

1. Edit the my-app-manifest.yml
2. As currently predix support the NoSQL databse, so add the host from some external cloud like AWS in the config/index.js file.
```
---
applications:
- name: <front end app name>
  memory: 256M
  buildpack: nodejs_buildpack
  command:  npm start
services:
- <asset instance service name>
- <timeseries instance service name>
- <uaa instance service name>
env:
    node_env: cloud
    uaa_service_label : predix-uaa
    clientId: <client id with timeseries and asset scope>
    base64ClientCredential: <base64 encoding of client id>
    # Following properties configured only for Timeseries WindData service Integration
    assetMachine: <The asset name pushed to Asset service>
    tagname: <The asset tag pushed to Asset service>
```

`predix push <appName> -f manifest.yml`

Navigate to <https://URL> in your web browser.