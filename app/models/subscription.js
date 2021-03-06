import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  organization: DS.belongsTo('organization'),
  plan: DS.belongsTo('plan', {async: false}),
  billingEmail: DS.attr(),
  currentUsage: DS.attr('number'),
  status: DS.attr(),
  currentPeriodStart: DS.attr('date'),
  currentPeriodEnd: DS.attr('date'),
  trialStart: DS.attr('date'),
  trialEnd: DS.attr('date'),
  isTrialOrFree: Ember.computed.or('plan.isTrial', 'plan.isFree'),
  isCustomer: Ember.computed.not('isTrialOrFree'),

  // This is only here so that ember-data will send the token on create, it will never be populated
  // in API responses.
  token: DS.attr(),

  subscriptionData: Ember.inject.service(),
  currentUsageRemaining: Ember.computed('currentUsage', 'plan.usageIncluded', function() {
    return this.get('plan.usageIncluded') - this.get('currentUsage');
  }),
  trialDaysRemaining: Ember.computed('trialEnd', function() {
    return Math.round(moment(this.get('trialEnd')).diff(moment(), 'days', true));
  }),
});

