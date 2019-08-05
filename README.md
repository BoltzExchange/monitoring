# Monitoring [![Build Status](https://travis-ci.org/BoltzExchange/monitoring.svg?branch=master)](https://travis-ci.org/BoltzExchange/monitoring)

Monitoring of the Boltz backend with Google Cloud Functions

## How to setup locally

Google Cloud Datastore is used to store the result of the last request to a particular Boltz instance. The cloud function is using the default credentials that can be setup with:

```shell
gcloud auth application-default login
```

If the function should also send Discord messages a webhook URL has to be provided via an environment variable:

```shell
export DISCORD_WEBHOOK='<webhook URL>'
```

These webhook URLs can be generated in the `Webhooks` section of the settings of the Discord server to which the messages should be sent.

Once the prerequisites are setup the function can be compiled and run with:

```shell
npm run compile
npm run start
```

## How to deploy to the Google Cloud

First a Cloud Function has to be created:

- in order to use the deploy script call the function `checkBoltzStatus`
- 128 MB of memory are more than enough
- the trigger should be HTTP
- the recommended runtime is `Node.js 10 (beta)`, although `Node.js 8` might work as well
- the function to execute is `checkBoltzStatus`
- in order to send Discord messages set the environment variable `DISCORD_WEBHOOK` to a webhook of your Discord server

Create the function and execute the following commands to deploy to source code to the function:

```shell
npm run compile
npm run deploy
```

To call the function on a regular basis create a new Cloud Scheduler job with a HTTP target that points to the URL of the Cloud function that was created before.

## How to run

The function exposes an HTTP endpoint which can be invoked with the URL parameter `url`. The boltz instance running on that URL will be pinged to make sure it is online.

Example: `<function url>?url=boltz.exchange` will check the status of the Boltz instance running on [boltz.exchange](https://boltz.exchange).
