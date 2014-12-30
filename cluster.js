Cluster = new Mongo.Collection("cluster");
Chat    = new Mongo.Collection('chat');

if ( Meteor.isClient ) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Router.route('/', function () {
      this.render('home', {});
    });

    Router.route('/chat', {
        name: 'chat',
        path: '/chat/:_name',

        data: function () {
            return Cluster.findOne({name: this.params._name});
        },

        action: function () {
            this.render();
        }
    });

    Router.plugin('dataNotFound', {notFoundTemplate: '/chatNotFound'});

    // Body events
    Template.home.events({
        "submit .js-create-chat": function(event) {
            var name = event.target.text.value;

            // check for empty input eg. no name
            if ( name === '' || Cluster.findOne({name: name}) ) {
                Session.set("hasError", true);
                return false;
            }

            // call method addchat
            Meteor.call('addChat', name);

            // remove value from input
            event.target.text.value = '';
            Session.set("hasError", false);
            return false;
        }
    });

    Template.home.helpers({
        hasError: function() {
            return Session.get('hasError');
        }
    });
}

// Meteor Methods
Meteor.methods({
    "addChat": function(name) {
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
    }
});
