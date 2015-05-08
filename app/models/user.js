import DS from 'ember-data';

export default DS.Model.extend({
  login: DS.attr(),
  name: DS.attr(),
  avatarUrl: DS.attr(),
  githubId: DS.attr(),
  isWhitelisted: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  githubUrl: function() {
    return 'https://github.com/' + this.get('login');
  }.property('login'),
});
