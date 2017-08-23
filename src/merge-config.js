export default function (defaultOptions, options, ...args) {
  let resultOption = {
    ...defaultOptions,
    getValueFromEvent: (e) => {
      if (!e || !e.target) {
        return e;
      }
      const { target } = e;
      return target[resultOption.valuePropName];
    },
  };
  if (typeof (options) === 'number') {
    resultOption = {
      ...resultOption,
      triggerMs: options,
    };
    if (typeof (args[1]) === 'boolean') {
      resultOption = {
        ...resultOption,
        uncontroll: args[1],
      };
    }
    if (typeof (args[0]) === 'number') {
      resultOption = {
        ...resultOption,
        valuePropMs: args[0],
      };
    }
  }

  if (typeof (options) === 'object' && !Array.isArray(options)) {
    resultOption = {
      ...resultOption,
      ...options,
    };
  }

  return resultOption;
}
