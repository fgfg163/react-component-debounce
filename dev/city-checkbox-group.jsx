import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Col, Collapse, Row, Switch } from 'antd';
import shouldUpdate from './should-update';
import reactFormFieldDebounce from '../src/index';

const CheckboxA = reactFormFieldDebounce({
  valuePropName: 'checked',
  triggerMs: 250,
})(Checkbox);
const Panel = Collapse.Panel;

const calValueIndex = (value = [], options = {}) => {
  if (Object.keys(options) === 0) {
    return {};
  }
  const theValueSet = new Set(value);
  const valueIndex = {};
  Object.entries(options).forEach(([key, subOptions]) => {
    valueIndex[key] = valueIndex[key] || {};
    Object.entries(subOptions).forEach(([key2, subOptions2]) => {
      valueIndex[key][key2] = valueIndex[key][key2] || new Set();
      subOptions2.forEach((city) => {
        if (theValueSet.has(city)) {
          valueIndex[key][key2].add(city);
        }
      });
    });
  });
  return valueIndex;
};

const calAllCityList = (options = {}) => (
  [].concat(
    ...([].concat(
      ...Object.values(options).map(e => Object.values(e)),
    )),
  )
);

const callAllPanelKey = (options = {}) => {
  const panelKey = new Set();
  Object.entries(options).forEach(([key, subOptions]) => {
    panelKey.add(key);
    Object.keys(subOptions).forEach((key2) => {
      panelKey.add(key2);
    });
  });
  return [...panelKey];
};

class CityCheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    const allPanelKey = callAllPanelKey(props.options);
    this.state = {
      search: '',
      value: new Set(props.value),
      allCityList: calAllCityList(props.options),
      valueIndex: calValueIndex(props.value),
      activeKey: [],
      allPanelKey,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (shouldUpdate(['value', 'options'], this.props, nextProps)) {
      if (typeof (nextProps.value) !== 'undefined') {
        this.setState({
          value: new Set(nextProps.value),
          valueIndex: calValueIndex(nextProps.value, nextProps.options),
        });
      }
    }
    if (shouldUpdate(['options'], this.props, nextProps)) {
      const allPanelKey = callAllPanelKey(nextProps.options);
      this.setState({
        allCityList: calAllCityList(nextProps.options),
        allPanelKey,
      });
    }
  }

  handleCitySelectAllChange = (event, allList = []) => {
    const { options, onChange } = this.props;
    const { value: oldValue } = this.state;
    const checked = event.target ? event.target.checked : event;
    let theALlList = allList;
    if (!Array.isArray(theALlList)) {
      theALlList = Object.values(theALlList);
    }
    if (theALlList.length > 0 && typeof (theALlList[0]) === 'object') {
      theALlList = [].concat(...theALlList);
    }

    const newValue = oldValue;
    if (checked) {
      theALlList.forEach(e => newValue.add(e));
    } else {
      theALlList.forEach(e => newValue.delete(e));
    }
    const theValueArr = [...newValue];
    this.setState({
      value: newValue,
      valueIndex: calValueIndex(theValueArr, options),
    });
    onChange(theValueArr);
  }

  handleOnChange = (event, name, key, key2) => {
    const { onChange } = this.props;
    const { value, valueIndex } = this.state;
    const checked = event.target ? event.target.checked : event;
    let theValueSet = valueIndex[key] || {};
    theValueSet = theValueSet[key2] || new Set();
    if (checked) {
      theValueSet.add(name);
      value.add(name);
    } else {
      theValueSet.delete(name);
      value.delete(name);
    }
    this.setState({
      value,
      valueIndex,
    });
    onChange([...value]);
  }

  handleOpenAllPanel = (event) => {
    const { allPanelKey } = this.state;
    if (event) {
      this.setState({ activeKey: allPanelKey });
    } else {
      this.setState({ activeKey: [] });
    }
  }

  handleOpenPanelChange = (value) => {
    this.setState({ activeKey: value });
  }

  render() {
    const { options, disabled } = this.props;
    const { value, allCityList, valueIndex, activeKey } = this.state;

    return (
      <div>
        <Row style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Col xs={24}>
            <Checkbox
              disabled={disabled}
              checked={value.size >= allCityList.length && allCityList.length > 0}
              indeterminate={value.size > 0}
              onChange={event => this.handleCitySelectAllChange(event, allCityList)}
            >
              全选
            </Checkbox>
            <span style={{ marginRight: 18 }}>已选择 {value.size} / {allCityList.length} </span>
            <Switch defaultChecked={false} onChange={this.handleOpenAllPanel} /> 全部展开
          </Col>
        </Row>
        <div className="ant-checkbox-group">
          <Collapse activeKey={activeKey} onChange={this.handleOpenPanelChange}>
            {Object.entries(options).map(([key, subOptions]) => {
              let selectAllChecked = true;
              let selectAllIndeterminate = false;
              let selectNum = 0;
              let allNum = 0;
              // 遍历一遍子节点选中情况
              Object.entries(subOptions).forEach(([key2, subOptions2]) => {
                let theValueSet = valueIndex[key] || {};
                theValueSet = theValueSet[key2] || new Set();
                selectNum += theValueSet.size;
                allNum += subOptions2.length;
                if (theValueSet.size > 0) {
                  selectAllIndeterminate = true;
                }
                if (theValueSet.size < subOptions2.length) {
                  selectAllChecked = false;
                }
              });
              return (
                <Panel
                  key={key}
                  header={
                    <div role="presentation" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        disabled={disabled}
                        checked={selectAllChecked}
                        indeterminate={selectAllIndeterminate}
                        onChange={event => this.handleCitySelectAllChange(event, subOptions)}
                      >
                        {key}
                      </Checkbox>
                      <span style={{ marginLeft: 18 }}>已选择 {selectNum} / {allNum} </span>
                    </div>
                  }
                >
                  <Collapse activeKey={activeKey} onChange={this.handleOpenPanelChange}>
                    {Object.entries(subOptions).map(([key2, subOptions2]) => {
                      let theValueSet = valueIndex[key] || {};
                      theValueSet = theValueSet[key2] || new Set();
                      return (
                        <Panel
                          key={key2}
                          header={<div role="presentation" onClick={e => e.stopPropagation()}>
                            <Checkbox
                              disabled={disabled}
                              checked={
                                theValueSet.size >= subOptions2.length
                                && subOptions2.length > 0
                              }
                              indeterminate={theValueSet.size > 0}
                              onChange={
                                event => this.handleCitySelectAllChange(event, subOptions2)
                              }
                            >
                              {key2}
                            </Checkbox>
                            <span style={{ marginLeft: 18 }}>
                              已选择
                              {theValueSet.size} / {subOptions2.length}
                            </span>
                          </div>}
                        >
                          <div>
                            {subOptions2.map(item => (
                              <CheckboxA
                                key={item}
                                checked={theValueSet.has(item)}
                                onChange={event => this.handleOnChange(event, item, key, key2)}
                              >
                                {item}
                              </CheckboxA>
                            ))}
                          </div>
                        </Panel>
                      );
                    })
                    }
                  </Collapse>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
    );
  }
}


CityCheckboxGroup.defaultProps = {
  onChange: () => false,
  options: {},
  value: undefined,
  disabled: false,
};

CityCheckboxGroup.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.objectOf(PropTypes.object),
  value: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
};

export default CityCheckboxGroup;
