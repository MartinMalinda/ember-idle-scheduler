# ember-idle-scheduler

Simple promise wrap around `requestIdleCallback` and a promise (priority) queue.

## The problem

Simply calling `requestIdleCallback` from different places in the code can result that all these callbacks are fired within one same idle frame. This can cause jank, or delay time to interactivity. Calling `requestIdleCallback` withing `requestIdleCallback` ensures that the next logic is executed in next idle frame. But this is not always possible.

(For some usecases usin Web Worker is more effective. RIC is easier to set up though).

## The queue

Wrapping `requestIdleCallback` in a promise and adding those promises in a promise queue ensures that that different idle frame is received on each call.

Simply inject a service and add a callback to the queue.

```javascript

  idle: inject.service(),

  _setFoo() {
    this.get('idle').schedule(100).then(() => {
      this.set('foo', this.get('_value'));
    });
  }
```

`requestIdleCallback` can be used to delay non essential logic to lower the time to interactivity. Non essential logic can be firing up analytics, including external scripts (that are not being used in the current route) or loading content in advance.

In this example, google analytics script is included in first idle frame and a track request is fired in next one.

```javascript

  getGA(){
    return this.get('idle').schedule(1000).then(() => {
      return $.getScript('https://www.google-analytics.com/analytics.js');
    }).then(() => {
      let gaTrackingId = this.get('gaTrackingId');
      window.ga('create', gaTrackingId, 'auto');
    });
  },

  googleAnalytics: computed(function(){
    return this.getGA();
  }),

  track(cb){
    if(this.get('gaTrackingId')){
      return this.get('googleAnalytics').then(() => {
        return this.get('idle').schedule(1000);
      }).then(cb);
    }
  },

  trackPage(page, title){
    this.track(() => {   
      window.ga('send', {
        hitType: 'pageview',
        page,
        title
      });
    });
  }
```


## Installation

* `git clone <repository-url>` this repository
* `cd ember-idle-scheduler`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
