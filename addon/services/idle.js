import Ember from 'ember';
import PQueue from 'npm:p-queue';

const {RSVP, computed} = Ember;

export default Ember.Service.extend({

  isWaiting: false,
  queue: computed(function(){
    return new PQueue({concurrency: 1, promise: RSVP.Promise});
  }),

  request(timeout){
    return new RSVP.Promise(innerResolve => {
      if(typeof requestIdleCallback === 'function'){
        return requestIdleCallback(innerResolve, {timeout})
      }

    return setTimeout(innerResolve, 0);
    });
  },

  schedule(timeout){
    return this.get('queue').add(() => this.request(timeout));
  },

});
