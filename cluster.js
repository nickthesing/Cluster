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
    action: 'show'
})

if ( Meteor.isClient ) {

    Template.registerHelper('parseDate', function(date) {
        return moment(date).format('HH:MM:SS');
    });

  ChatController = RouteController.extend({
    layoutTemplate: 'chatLayout',

    data: function() {
        var d = Cluster.find({name: this.params._name});

        if ( ! d ) return;

        var name = d.fetch();

        var data = {
            name: ( name[0] ) ? '['+name[0].name+']' : '',
            lines: d
        }

        return data;
    },

    show: function () {
        this.render('chat');
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
            Router.go('/chat/'+name);
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
            username: Meteor.user().username,
            start: true,
            text: ''
        });
    }
});
