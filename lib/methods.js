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