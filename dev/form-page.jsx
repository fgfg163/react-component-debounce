import React from 'react';

import { Checkbox, Icon } from 'antd';
import reactFormFieldDebounce from '../src/index.jsx';

const CheckboxA = reactFormFieldDebounce({
  valuePropMs: 1000,
  valuePropName: 'checked',
  triggerMs: 1000,
  trigger: 'onChange',
})(Checkbox);

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  onChange = (e) => {
    console.log(e);
    this.setState({ checked: e });
  }

  render() {
    const { checked } = this.state;

    return (
      <div className="test-page">
        <CheckboxA checked={checked} onChange={this.onChange}>12341235afsdasdfBBBBBB</CheckboxA>
      </div>
    );
  }
}

TestPage.defaultProps = {};

TestPage.propTypes = {};

export default TestPage;

