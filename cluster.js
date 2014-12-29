Cluster = new Mongo.Collection("cluster");
Chat    = new Mongo.Collection('chat');

if ( Meteor.isClient ) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    // Body events
    Template.body.events({
        "submit .js-create-chat": function(event) {
            var name = event.target.text.value;

            // check for empty input eg. no name
            if ( name === '' ) {
                Session.set("hasError", true);
                return false;
            }

            // call method addchat
            if ( Meteor.call("getChat", name) ) {
                Session.set('hasError', true);
                return false;
            }

            Meteor.call('addChat', name);

            // remove value from input
            event.target.text.value = '';
            Session.set("hasError", false);
            return false;
        }
    });

    Template.body.helpers({
        hasError: function() {
            return Session.get('hasError');
        }
    });
}

// Meteor Methods
Meteor.methods({
    "addChat": function(name) {
        check(name, String);

        // Check if user is logged in
        if ( ! Meteor.userId() ) {
            throw new Meteor.error("not-authorized");
        }

        Cluster.insert({
            name: name,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });

        console.log('Inserted:', name);

    },
    "getChat": function(name) {
        return Cluster.findOne({name: name});
    }
});
