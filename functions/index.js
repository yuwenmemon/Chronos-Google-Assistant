'use strict';

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Import the slack client
const { WebClient } = require('@slack/web-api');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Hardcode the token for now and instantiate the app:
const token = '<INSERT_XOXP_TOKEN_HERE>';
const slackClient = new WebClient(token);

// Handle any "Start" like commands
app.intent('start', (conv) => {
    conv.ask(`<speak>Hello, Let's get your day started!</speak>`);
    (async () => {
        try {
            slackClient.chat.postMessage({
                text: 'Start',
                channel: 'DGK2P42JZ', // Chronos
                as_user: true
            });
        } catch (error) {
            handleSlackErrors(error);
        }
    })();
});

// Handle any "Stop" like commands
app.intent('stop', (conv) => {
    conv.ask(`<speak>Hello, Let's get your day stopped!</speak>`);
    (async () => {
        try {
            slackClient.chat.postMessage({
                text: 'Stop',
                channel: 'DGK2P42JZ', // Chronos
                as_user: true
            });
        } catch (error) {
            handleSlackErrors(error);
        }
    })();
});

// Handle everything else.
app.intent('general deeplink', (conv, {message}) => {
    conv.ask(`<speak>Hmmm... I'm not sure how to handle that one yet. I'm just going to directly send it to Chronos!</speak>`);
    (async () => {
        try {
            slackClient.chat.postMessage({
                text: message,
                channel: "DGK2P42JZ", // Chronos
                as_user: true
            });
        } catch (error) {
            handleSlackErrors(error);
        }
    })();
});

/**
 * Generic error handler for Slack.
 *
 * @param error
 */
function handleSlackErrors(error) {
    // Check the code property, and when its a PlatformError, log the whole response.
    if (error.code === ErrorCode.PlatformError) {
        console.log(error.data);
    } else {
        // Some other error, oh no!
        console.log('Well, that was unexpected. ' + error.code + ' ' + error.data);
    }
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
