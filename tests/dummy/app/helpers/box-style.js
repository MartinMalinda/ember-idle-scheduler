import Ember from 'ember';

export function boxStyle([item]) {
  return Ember.String.htmlSafe(`min-height: ${item.height}px;min-width:${item.width}px`);
}

export default Ember.Helper.helper(boxStyle);
