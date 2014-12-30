// Helpers
if ( Meteor.isClient ) {
    Template.registerHelper('parseDate', function(date) {
        return moment(date).format('HH:MM:SS');
    });

    Template.home.helpers({
        hasError: function() {
            return Session.get('hasError');
        }
    });
}

callFn = function(fn, data) {
    if ( fn.slice(1) === 'clear' ) {
        Meteor.call('clearChat', data);
    }
};