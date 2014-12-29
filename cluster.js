if (Meteor.client) {
    console.log('client?');

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}