Cluster = new Mongo.Collection("cluster");

if ( Meteor.isClient ) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    // Body events
    Template.body.events({
        "submit .js-create-chat": function(event) {
            var name = event.target.text.value;

            // check for empty input eg. no name
            if ( name === '' ) return;

            // call method
            Meteor.call('addChat', name);

            // remove value from input
            event.target.text.value = '';
            return false;
        }
    });
}

// Meteor Methods
Meteor.methods({
    "addChat": function(name) {
        // Check if user is logged in
        // if ( Meteor.userId() ) {
        //     throw new Meteor.error("not-authorized");
        // }

        console.log(name);
    }
});
