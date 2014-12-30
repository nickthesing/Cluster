Cluster = new Mongo.Collection("cluster");
Chat    = new Mongo.Collection('chat');

// Default Routes
Router.configure({
  layoutTemplate: 'home',
  template: 'home'
});

Router.route('/chat', {
    controller: 'ChatController',
    action: 'notSpecified'
});

Router.route('/chat/:_name', {
    controller: 'ChatController',
    action: 'chat'
});

if ( Meteor.isClient ) {
    ChatController = RouteController.extend({
        layoutTemplate: 'chatLayout',
        loadingTemplate: 'chatLoading',
        waitOn: function () {
            return Meteor.subscribe('cluster');
        },

        data: function() {
            return Cluster.findOne({name: this.params._name});
        },

        chat: function () {
            if (this.ready()) {
                this.render('chat');
            }
        },

        notSpecified: function () {
          this.render('chatNotSpecified');
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

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

if (Meteor.isServer) {
    Meteor.publish("cluster", function () {
        return Cluster.find({});
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
