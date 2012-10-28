var FSM = module.exports = function(transitions) {
  this.transitions = transitions;
};
FSM.prototype.feed = function(input) {
  if (input === 'undefined') input = undefined;
  // if you call fsm.feed(), with no argument, it will return the start state.
  //   if you plan to do that, the transitions matrix should have one
  //   [undefined, 'start_state'] pair.
  for (var i = 0, l = this.transitions.length; i < l; i++) {
    var trigger = this.transitions[i][0],
      action = this.transitions[i][1];
    if (trigger instanceof RegExp) {
      var m = input.match(trigger);
      if (m) {
        // regular expressions with a function-trigger get the match
        return this._apply(action, m);
      }
    }
    else if (trigger === input) {
      // but normal strings with a function-trigger get the input string
      return this._apply(action, input);
    }
  }
  // return this.transduce();
};
FSM.prototype._apply = function(action, input) {
  if (typeof action === 'function') {
    return action.call(this, input);
  }
  else {
    // presumably, action is a string. We hope so!
    return action;
  }
};
