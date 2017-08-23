import React from 'react';
import debounce from './debounce';
import shouldUpdate from './should-update';
import defaultOptions from './config';

export default (options = defaultOptions, ...restParam) => {
  let theOptions = {
    ...defaultOptions,
    getValueFromEvent: (e) => {
      if (!e || !e.target) {
        return e;
      }
      const { target } = e;
      return target[theOptions.valuePropName];
    },
  };

  if (typeof (options) === 'number') {
    theOptions = {
      ...theOptions,
      triggerMs: options,
    };
    if (typeof (restParam[1]) === 'boolean') {
      theOptions = {
        ...theOptions,
        uncontroll: restParam[1],
      };
    }
    if (typeof (restParam[0]) === 'number') {
      theOptions = {
        ...theOptions,
        valuePropMs: restParam[0],
      };
    }
  }

  if (typeof (options) === 'object' && !Array.isArray(options)) {
    theOptions = {
      ...theOptions,
      ...options,
    };
  }

  return (ReactElement) => {
    class ReactFormFieldDebounce extends React.Component {
      constructor(props) {
        super(props);
        this.isMount = false;
        this.lastValue = '';
        this.shouldUpdatePropsList = (() => {
          let thePropsList = Object.keys(ReactElement.propTypes || {});
          if (thePropsList.length === 0) {
            thePropsList = Object.keys(props || {});
          }
          return thePropsList
            .filter(e => e !== theOptions.valuePropName)
            .filter(e => e !== theOptions.trigger)
            .filter(e => !e.match(/^data-/))
            .filter(e => typeof (props[e]) !== 'function');
        })();
        this.state = {};
        if (Object.prototype.hasOwnProperty.call(props, theOptions.valuePropName)) {
          this.state[theOptions.valuePropName] = props[theOptions.valuePropName];
          this.lastValue = props[theOptions.valuePropName];
        }
      }

      componentDidMount() {
        this.isMount = true;
        const self = this;
        if (theOptions.uncontroll) {
          self.setState({ [theOptions.valuePropName]: undefined });
        }
      }

      componentWillReceiveProps(nextProps) {
        if (shouldUpdate([theOptions.valuePropName], this.props, nextProps)) {
          if (this.lastValue !== nextProps[theOptions.valuePropName]) {
            this.valueUpdateDebounce(nextProps[theOptions.valuePropName]);
          }
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (theOptions.shouldComponentUpdate) {
          return theOptions.shouldComponentUpdate.call({
            state: this.state,
            props: this.props,
          }, nextProps, nextState);
        }
        if (this.state !== nextState) {
          return true;
        }
        if (shouldUpdate(this.shouldUpdatePropsList, this.props, nextProps)) {
          return true;
        }

        return false;
      }

      componentDidUpdate() {
        const self = this;
        if (theOptions.uncontroll) {
          if (typeof (this.state[theOptions.valuePropName]) !== 'undefined') {
            self.setState({ [theOptions.valuePropName]: undefined });
          }
        }
      }

      componentWillUnmount() {
        this.isMount = false;
      }


      onChange = (() => {
        let updb = this.props[theOptions.trigger];
        if (theOptions.triggerMs >= 0) {
          updb = debounce((value) => {
            this.props[theOptions.trigger](value);
          }, theOptions.triggerMs);
        }
        return updb;
      })()

      handleOnChange = (event) => {
        const value = theOptions.getValueFromEvent(event);
        if (!theOptions.uncontroll) {
          this.setState({ [theOptions.valuePropName]: value });
        }
        this.lastValue = value;
        this.onChange(value);
        if (event && event.target) {
          theOptions.uncontroll = false;
        }
      }

      valueUpdateDebounce = (() => {
        if (theOptions.valuePropMs >= 0) {
          return debounce((value) => {
            this.lastValue = value;
            this.setState({ [theOptions.valuePropName]: value });
          }, theOptions.valuePropMs);
        }
        return (value) => {
          this.lastValue = value;
          this.setState({ [theOptions.valuePropName]: value });
        };
      })()

      render() {
        const theProps = {
          ...this.props,
          ...this.state,
        };
        if (theOptions.uncontroll) {
          if (typeof (theProps[theOptions.valuePropName]) === 'undefined') {
            delete theProps[theOptions.valuePropName];
          }
        }
        if (Object.prototype.hasOwnProperty.call(theProps, theOptions.trigger)) {
          theProps[theOptions.trigger] = this.handleOnChange;
        }

        return (<ReactElement {...theProps} />);
      }
    }

    ReactFormFieldDebounce.defaultProps = ReactElement.defaultProps;
    ReactFormFieldDebounce.propTypes = ReactElement.propTypes;
    ReactFormFieldDebounce.displayName = `ReactFormFieldDebounce(${ReactElement.name})`;

    return ReactFormFieldDebounce;
  };
};
