import Ember from 'ember';

const {inject, computed,run} = Ember;

export default Ember.Controller.extend({
  idle: inject.service(),

  init() {
    this._super(...arguments);

    this.generateContent();
  },

  genArray(N) {
    return Array.apply(null, {length: N}).map(Number.call, Number);
  },

  timestamps: [],

  renderDelta: computed('timestamps.[]', function(){

    let timestamps = Ember.A(this.get('timestamps'));
    if(timestamps.length > 10){ 
      let lastTen = timestamps.slice(Math.max(timestamps.length - 10, 1));


      let deltas = lastTen.map((item, index) => {
        if(index > 0) {
          return item - lastTen[index -1];
        }

        return 0;
      });

      return deltas.reduce((prev, next) => prev + next)/10;
    }

  }),

  generateContent() {
    let idle = this.get('idle');

    idle.schedule(100).then(() => {

      this.get('timestamps').pushObject(performance.now());

      let min = 0;
      let max = parseInt(Math.random() * 100) / 2;
      let content = this.genArray(max).map(n => {
        return {
          width: parseInt(Math.random() * 100),
          height: parseInt(Math.random() * 100),
          content: `Box ${n}`
        };
      });

      this.set('content', content);

      this.generateContent();
    });
  },

  _setFoo() {
    this.get('idle').schedule(100).then(() => {
      this.set('foo', this.get('_value'));
    });
  },

  actions: {
    setFoo(value) {
      this.set('_value', value);
      run.throttle(this, this._setFoo, 100);
    }
  }

});
