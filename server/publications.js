// Meteor.publish definitions
if (Meteor.isServer) {
    Meteor.publish("cluster", function () {
        return Cluster.find({});
  });
}