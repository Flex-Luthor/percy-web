import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  currentUser: Ember.computed.alias('session.data.authenticated.user'),

  isEnabled: false,
  userInstance: null,
  organizationInstance: null,

  init() {
    this.isEnabled = !!window.amplitude;

    if (!this.isEnabled) {
      return;
    }

    this.userInstance = window.amplitude
      .getInstance(config.APP.AMPLITUDE_USERS_INSTANCE_NAME);
    this.userInstance.init(config.APP.AMPLITUDE_USERS_PROJECT_ID);

    this.organizationInstance = window.amplitude
      .getInstance(config.APP.AMPLITUDE_ORGANIZATIONS_INSTANCE_NAME);
    this.organizationInstance.init(config.APP.AMPLITUDE_ORGANIZATIONS_PROJECT_ID);
  },

  invalidate() {
    if (!this.isEnabled) {
      return;
    }

    this.userInstance.setUserId(null);
    this.userInstance.regenerateDeviceId();

    this.organizationInstance.setUserId(null);
    this.organizationInstance.regenerateDeviceId();
  },

  identifyUser(user) {
    if (!this.isEnabled) {
      return;
    }

    let userProperties = {
      login: user.get('login'),
      email: user.get('email'),
      name: user.get('name')
    };

    this.userInstance.setUserId(user.get('id'));
    this.userInstance.setUserProperties(userProperties);
  },

  track(eventName, organization, eventProperties = {}) {
    // window.console.log('Analytics track called:', eventName, organization, eventProperties);
    if (!this.isEnabled) {
      return;
    }

    let userEventProperties = eventProperties;
    let groups = {};
    if (organization) {
      userEventProperties = Object.assign(
        {
          'organization_id': organization.get('id'),
          'organization_slug': organization.get('slug'),
        },
        eventProperties
      );

      groups['organization_id'] = organization.get('id');
    }

    this.userInstance.logEventWithGroups(eventName, userEventProperties, groups);

    if (organization) {
      this.organizationInstance.setUserId(organization.get('id'));
      let organizationEventProperties = Object.assign(
        {'user_id': this.get('currentUser.id')},
        eventProperties
      );
      this.organizationInstance.logEvent(eventName, organizationEventProperties);
    }
  },
});
