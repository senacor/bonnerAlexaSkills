/* eslint-disable  func-names */
/* eslint-disable  no-console */

const rp = require('request-promise');
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Willkommen bei den Bonner University Days Tag 2';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hallo Welt', speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hallo André!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hallo Welt', speechText)
      .getResponse();
  },
};

const FinancialIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FinancialIntent';
  },
  async handle(handlerInput) {

    let login = {
      method: 'POST',
      uri: 'https://bankapi-public-test.postbank.de/bankapi-public/blau/v1/authentication/external/login',
      headers: {
        'api-key': '494f423500225fd9'
      },
      form: {
        username: 'username', //insert username
        password: 'password' //insert password
      },
      json: true // Automatically stringifies the body to JSON
    };

    let loginResult = await rp(login);

    let financialstatus = {
      method: 'GET',
      uri: 'https://bankapi-public-test.postbank.de/bankapi-public/blau/v1/banking/external/financialstatus',
      headers: {
        'api-key': '494f423500225fd9',
        Authorization: 'Bearer ' + loginResult.jwt
      },
      json: true // Automatically stringifies the body to JSON
    };

    let financialstatusResult = await rp(financialstatus);

    return handlerInput.responseBuilder
        .speak('Hallo ' + loginResult.name + '. Dein Kontostand lautet ' + financialstatusResult.totalAmount + ' Euro')
        .withSimpleCard('Hallo Welt', "test")
        .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Sag hallo';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hallo Welt', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'tschüss!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Es ist ein Fehler aufgetreten.')
      .reprompt('Es ist ein Fehler aufgetreten.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
      LaunchRequestHandler,
      HelloWorldIntentHandler,
      FinancialIntentHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

exports.debug = {  LaunchRequestHandler,
  FinancialIntentHandler,
  HelloWorldIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler};
