// Template events
if ( Meteor.isClient ) {
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

    Template.chat.events({
        "submit .js-create-line": function(event) {
            var opt = {
                text: event.target.text.value,
                name: Session.get('chatName')
            }

            Meteor.call('addLine', opt);

            return false;
        }
    });
}