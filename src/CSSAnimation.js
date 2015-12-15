
var assign = require('object-assign');

var ReactTransitionGroup = React.addons.TransitionGroup;
var CSSAnimationChild = require('./CSSAnimationChild');

function createTransitionTimeoutPropValidator(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (props[timeoutPropName] == null) {
        return new Error(timeoutPropName + ' wasn\'t supplied to CSSAnimation: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] !== 'number') {
          return new Error(timeoutPropName + ' must be a number (in milliseconds)');
        }
    }
  };
}

var CSSAnimation = React.createClass({
  displayName: 'CSSAnimation',

  propTypes: {
    name: CSSAnimationChild.propTypes.name,
    appear: React.PropTypes.bool,
    enter: React.PropTypes.bool,
    leave: React.PropTypes.bool,
    appearTimeout: createTransitionTimeoutPropValidator('Appear'),
    enterTimeout: createTransitionTimeoutPropValidator('Enter'),
    leaveTimeout: createTransitionTimeoutPropValidator('Leave'),
    callback: CSSAnimationChild.propTypes.callback
  },

  getDefaultProps: function () {
    return {
      appear: false,
      enter: true,
      leave: true,
      callback: {
        willAppear: function() {},
        didAppear: function() {},
        willEnter: function() {},
        didEnter: function() {},
        willleave: function() {},
        didleave: function() {}
      }
    };
  },

  _wrapChild: function (child) {
    // We need to provide this childFactory so that
    // CSSAnimationChild can receive updates to name, enter, and
    // leave while it is leaving.
    return React.createElement(CSSAnimationChild, {
      name: this.props.name,
      appear: this.props.appear,
      enter: this.props.enter,
      leave: this.props.leave,
      appearTimeout: this.props.appearTimeout,
      enterTimeout: this.props.enterTimeout,
      leaveTimeout: this.props.leaveTimeout,
      callback: this.props.callback
    }, child);
  },

  render: function () {
    return React.createElement(ReactTransitionGroup, assign({}, this.props, { childFactory: this._wrapChild }));
  }
});

module.exports = CSSAnimation;