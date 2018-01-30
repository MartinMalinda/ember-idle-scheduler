import Ember from 'ember';
import PQueue from 'npm:p-queue';

const { RSVP, computed } = Ember;

export default Ember.Service.extend({

  isWaiting: false,

  useRequestIdleCallbackInTests: false,
  useRequestIdleCallback: computed('useRequestIdleCallbackInTests', function() {
    return 'requestIdleCallback' in window && (!Ember.testing || this.get('useRequestIdleCallbackInTests'));
  }),

  queue: computed(function() {
    return new PQueue({concurrency: 1, promise: RSVP.Promise});
  }),

  request(timeout) {
    return new RSVP.Promise(innerResolve => {
      if (this.get('useRequestIdleCallback')) {
        return window.requestIdleCallback(innerResolve, {timeout})
      }

    return Ember.run.next(innerResolve);
    });
  },

  schedule(timeout) {
    return this.get('queue').add(() => this.request(timeout));
  }
});
