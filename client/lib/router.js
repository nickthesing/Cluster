// Router setup
if ( Meteor.isClient ) {
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

    ChatController = RouteController.extend({
        layoutTemplate: 'chatLayout',
        loadingTemplate: 'chatLoading',
        waitOn: function () {
            return Meteor.subscribe('cluster');
        },

        data: function() {
            var d = Cluster.find({name: this.params._name});

            if ( ! d ) return;

            var name = d.fetch();

            var data = {
                name: ( name[0] ) ? name[0].name : undefined,
                lines: d
            }

            if ( name[0] ) {
                Session.set('chatName', name[0].name);
            }

            return data;
        },

        chat: function () {
            if (this.ready()) {
                this.render('chatLoaded');
            }
        },

        notSpecified: function () {
          this.render('chatNotSpecified');
        }
    });
}