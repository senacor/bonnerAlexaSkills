let handler = require("./index").debug;

const getMockResponseBuilder = () => {
    const that = {
        speak: (speechText) => {
            that.speechText = speechText;
            return that;
        },
        reprompt: (repromptText) => {
            that.repromptText = repromptText;
            return that;
        },
        withSimpleCard: (title, cardText) => {
            that.simpleCardTitle = title;
            that.simpleCardText = cardText;
            return that;
        },
        withShouldEndSession: (shouldEndSession) => {
            that.shouldEndSession = shouldEndSession;
            return that;
        },
        withAskForPermissionsConsentCard: (permissions) => {
            that.requestedPermissions = permissions;
            return that;
        },
        addDelegateDirective: (updatedIntent) => {
            const mockResponse = {
                ...that,
                updatedIntent
            };
            return mockResponse;
        },
        getResponse: () => that,
        speechText: '',
        repromptText: '',
        simpleCardText: '',
        simpleCardTitle: '',
        shouldEndSession: undefined,
        updatedIntent: undefined,
        hasDelegateDirective: false
    };
    return that;
};

handler.FinancialIntentHandler.handle({responseBuilder: getMockResponseBuilder()}).then( (out) => console.log(out));
