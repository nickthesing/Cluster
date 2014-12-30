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
});

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

        if ( name[0] ) {
            Session.set('chatName', name[0].name);
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

    callFn = function(fn, data) {
        if ( fn.slice(1) === 'clear' ) {
            Meteor.call('clearChat', data);
        }
    },

    Template.chat.events({
        "submit .js-create-line": function(event) {
            event.preventDefault();

            text = event.target.text.value,
            fns = ['clear'];

            var opt = {
                text: text,
                name: Session.get('chatName')
            }

            if ( text.indexOf('!') === 0 && fns.indexOf(text.slice(1)) > -1 ) {

                callFn(text,opt);

                event.target.text.value = '';
                return;
            }

            Meteor.call('addLine', opt);
            event.target.text.value = '';
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
    },
    "addLine": function(opt) {
        if ( ! Meteor.userId() ) {
            throw new Meteor.error("not-authorized");
        }

        Cluster.insert({
            name: opt.name,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            start: false,
            text: opt.text
        });
    },
    "clearChat": function(data) {
        Cluster.remove({
            name: data.name,
            start: false
        });
    }
});
