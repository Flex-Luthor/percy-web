import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      owner: this.modelFor('owner'),
      repos: this.store.find('repo'),
    });
  },
});