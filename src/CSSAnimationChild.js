
var CSSCore = require('./CSSCore');
var ReactTransitionEvents = require('./ReactTransitionEvents');

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
var TICK = 17;

var AnimationCSSChild = React.createClass({
  displayName: 'AnimationCSSChild',

  propTypes: {
    name: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.shape({
      enter: React.PropTypes.string,
      leave: React.PropTypes.string,
      active: React.PropTypes.string
    }), React.PropTypes.shape({
      enter: React.PropTypes.string,
      enterActive: React.PropTypes.string,
      leave: React.PropTypes.string,
      leaveActive: React.PropTypes.string,
      appear: React.PropTypes.string,
      appearActive: React.PropTypes.string
    })]).isRequired,

    // Once we require timeouts to be specified, we can remove the
    // boolean flags (appear etc.) and just accept a number
    // or a bool for the timeout flags (appearTimeout etc.)
    appear: React.PropTypes.bool,
    enter: React.PropTypes.bool,
    leave: React.PropTypes.bool,
    appearTimeout: React.PropTypes.number,
    enterTimeout: React.PropTypes.number,
    leaveTimeout: React.PropTypes.number,
    callback: React.PropTypes.shape({
      willAppear: React.PropTypes.func,
      didAppear: React.PropTypes.func,
      willEnter: React.PropTypes.func,
      didEnter: React.PropTypes.func,
      willleave: React.PropTypes.func,
      didleave: React.PropTypes.func
    })
  },

  getDefaultProps: function() {
    return {
      callback: {
        willAppear: function() {},
        didAppear: function() {},
        willEnter: function() {},
        didEnter: function() {},
        willleave: function() {},
        didleave: function() {}
      }
    }
  },

  transition: function (animationType, finishCallback, userSpecifiedDelay, lifeCircleCallback) {
    var node = React.findDOMNode(this);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    !!lifeCircleCallback && lifeCircleCallback(this.props.children);
    var className = this.props.name[animationType] || this.props.name + '-' + animationType;
    var activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
    var timeout = null;

    var endListener = function (e) {
      if (e && e.target !== node) {
        return;
      }

      clearTimeout(timeout);

      CSSCore.removeClass(node, className);
      CSSCore.removeClass(node, activeClassName);

      ReactTransitionEvents.removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    CSSCore.addClass(node, className);

    // Need to do this to actually trigger a transition.
    this.queueClass(activeClassName);

    // If the user specified a timeout delay.
    if (userSpecifiedDelay) {
      // Clean-up the animation after the specified delay
      timeout = setTimeout(endListener, userSpecifiedDelay);
      this.transitionTimeouts.push(timeout);
    } else {
      // DEPRECATED: this listener will be removed in a future version of react
      ReactTransitionEvents.addEndEventListener(node, endListener);
    }
  },

  queueClass: function (className) {
    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
    }
  },

  flushClassNameQueue: function () {
    if (this.isMounted()) {
      this.classNameQueue.forEach(CSSCore.addClass.bind(CSSCore, React.findDOMNode(this)));
    }
    this.classNameQueue.length = 0;
    this.timeout = null;
  },

  componentWillMount: function () {
    this.classNameQueue = [];
    this.transitionTimeouts = [];
  },

  componentWillUnmount: function () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.transitionTimeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });
  },

  componentWillAppear: function (done) {
    if (this.props.appear) {
      var willAppearCallback = this.props.callback.willAppear || function() {};
      this.transition('appear', done, this.props.appearTimeout, willAppearCallback);
    } else {
      done();
    }
  },

  componentDidAppear: function() {
    var didAppearCallback = this.props.callback.didAppear || function() {};
    didAppearCallback(this.props.children);
  },

  componentWillEnter: function (done) {
    if (this.props.enter) {
      var willEnterCallback = this.props.callback.willEnter || function() {};
      this.transition('enter', done, this.props.enterTimeout, willEnterCallback);
    } else {
      done();
    }
  },

  componentDidEnter: function() {
    var didEnterCallback = this.props.callback.didEnter || function() {};
    didEnterCallback(this.props.children);
  },

  componentWillLeave: function (done) {
    if (this.props.leave) {
      var willLeaveCallback = this.props.callback.willLeave || function() {};
      this.transition('leave', done, this.props.leaveTimeout, willLeaveCallback);
    } else {
      done();
    }
  },

  componentDidLeave: function() {
    var didLeaveCallback = this.props.callback.didLeave || function() {};
    didLeaveCallback(this.props.children);
  },

  onlyChild: function(children) {
     let length = React.Children.count(children);
     if (length !== 1) {
        console.error("AnimationChild: only one child can be passed in.")
     }
     else {
        return children;
     }
  },

  render: function () {
    return this.onlyChild(this.props.children);
  }
});

module.exports = AnimationCSSChild;