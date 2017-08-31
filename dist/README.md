# react-component-debounce
让你的 react 组件支持 debounce ！  
安装
```
npm i --save react-component-debounce
```
使用
```
import reactComponentDebounce from 'react-component-debounce';  
```
### API
#### reactComponentDebounce(triggerMs: number, valuePropMs?: number, uncontroll?:boolean)(ReactElementClass);  
接收设置参数，包装一个组件，返回包装后的组件
```
reactFormFieldDebounce(300)(ReactElementClass) //  => DebounceComponetClass
reactFormFieldDebounce(150, 150, true)(ReactElementClass) //  => DebounceComponetClass
```
#### reactComponentDebounce(options)(ReactElementClass);  
接收一个对象，包装一个组件，返回包装后的组件
```
reactComponentDebounce({
  triggerMs: number,                       
  trigger: string,
  valuePropMs: number,
  valuePropName: string,
  uncontroll: boolean,
  getValueFromEvent: function,
  shouldComponentUpdate: function || undefined,
})(componentClass);   //  => DebounceComponetClass
```
#### 示例
```
import reactComponentDebounce from 'react-component-debounmce';
import { Checkbox, Input } from 'antd'; 
const CheckboxGroup = Checkbox.Group;

const Checkbox = reactComponentDebounce(150)(Checkbox);
const InputA = reactComponentDebounce(150, 200)(Input);
const CheckboxGroupA = reactComponentDebounce(200, 300, true)(CheckboxGroup);

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onCheckboxGroupChange = this.onCheckboxGroupChange.bind(this);
    this.state = {
      input: '',
      checkbox: false,
      checkboxGroup: [],
    };
  }
  onInputChange(value) {
    this.setState({ input: value });
  }
  onCheckboxChange(value) {
    this.setState({ checkbox: value });
  }
  onCheckboxGroupChange(value) {
    this.setState({ checkboxGroup: value });
  }
  render() {
    return (
      <div>
        <div>
          <InputA value={this.state.input} onChange={this.onInputChange}/>
        </div>
        <div>
          <CheckboxA value={this.state.input} onChange={this.onInputChange}/>
        </div>
        <div>
          <CheckboxGroupA value={this.state.input} onChange={this.onInputChange}/>
        </div>
      </div>
    );
  }
}
```

### options
| 参数                   | 说明                                             |      类型                               | 默认值           |
| ---------------------- | ------------------------------------------------ |:---------------------------------------:|:--------:|
| triggerMs              | 收集子节点的值的延迟，单位 ms                    | number                                  | 0        |
| trigger                | 收集子节点的值的时机                             | string                                  | onChange | 
| valuePropMs            | 赋值子节点的延迟，单位 ms                        | number                                  | 0        | 
| valuePropName          | 子节点的值的属性，如 Switch 的是 'checked'       | string                                  | value    |
| uncontroll             | 是否切换非控制模式                               | boolean                                 | false    |
| getValueFromEvent      | 可以把 onChange 的参数（如 event）转化为控件的值 | function(..args)                        | function |
| shouldComponentUpdate  | 控制子组件的更新                                 | function(nextProps, nextState): boolean | function |

> 1. 使用 reactComponentDebounce 的组件应该包含一对 value、onChange 参数（或者是由 valuePropName、trigger 指定的参数名），并且 value 输入值和 onChange 返回值是一致的。
> 也就是说父组件不能在 onChange 时修改返回值再设置到 value 里。因为 onChange 会有延迟，用户会看到一个跳转的过程。通常会用于提升表单组件的性能。  
> 2. triggerMs == 0 时相当于为 onChange 增加了一个延迟为 0 的 debounce ，或者说延迟为 0 的 setTimeout。
> trigerMs == -1 时则不添加 debounce 。
> 3. trigger 可以将 onChange 设置成其他名称。
> 4. valuePropMs 与 triggerMs 类似，可以选择 0 或者 -1。
> 5. valuePropName 可以将 value 设置成其他名称。
> 6. 当 triggerMs 与 valuePropMs 同时设置成 -1，则只有 shouldComponentUpdate 功能会生效
> 7. uncontroll 模式：见下
> 8. getValueFromEvent：见下
> 9. shouldComponentUpdate：见下

#### uncontroll 模式  
在 controll 模式下子组件的 value 会同步缓存在 reactComponentDebounce 组件中，相对于父组件则是有延迟的。
这种模式适用于 html 原生表单组件或者对原生表单简单包装的组件例如 Input、CheckBox、Radio。  
一些复杂组件例如 Tree、Select、自定义组件则可以使用 uncontroll 模式。
有些组件在  uncontroll 模式下性能会更好。 uncontroll 模式下 reactComponentDebounce 不会设置子组件的 value 属性，当父组件改变 value 时，
reactComponentDebounce 会先赋值子组件的 value 然后再取消赋值，让子组件在 uncontroll 模式下能更新。

#### getValueFromEvent
可以把 onChange 的参数（如 event）转化为控件的值，默认值
```
function(e) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.value;
}
```
#### shouldComponentUpdate
默认会忽略 props 中类型为 function 的参数,同时为了适配 antd 的 Form 组件，过滤了 data- 开头的参数。
如果表单校验规则需要经常变化，请自定义 shouldComponentUpdate
 ```
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
 ```

#### 使用（在antd中使用）
```
import React from 'react';
import { Button, Checkbox, Col, Form, Input, Radio, Row } from 'antd'; // 框架组件
import CityCheckboxGroup from './city-checkbox-group';                 // 自定义组件
import reactFormFieldDebounce from '../src/index';                     // debounce工厂组件

const FormItem = Form.Item;
const InputA = reactFormFieldDebounce(150)(Input); 
const RadioGroupA = reactFormFieldDebounce(250)(Radio.Group);
const CityCheckboxGroupA = reactFormFieldDebounce({
  triggerMs: number,                       
  trigger: string,
  valuePropMs: number,
  valuePropName: string,
  uncontroll: boolean,
  getValueFromEvent: function,
  shouldComponentUpdate: function || undefined,
})(CityCheckboxGroup);

@Form.create({})
class FormPage extends React.Component {

  formLayout = {
    formItemBaseLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemInputLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemUploadLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemNoLableLayout: { labelCol: { xs: 0 }, wrapperCol: { xs: { span: 20, offset: 4 } } },
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      formItemBaseLayout,
      formItemInputLayout,
      formItemNoLableLayout,
    } = this.formLayout;

    return (
      <Form>

        <FormItem label="输入框">
          {getFieldDecorator('input1', {})(
            <InputA />,
          )}
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="单选框1"
        >
          <Col xs={20}>
            {getFieldDecorator('radio1', {})(
              <RadioGroupA size="large">
                <Radio value="1">有效</Radio>
                <Radio value="0">无效</Radio>
              </RadioGroupA>,
            )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="单选框2"
        >
          <Col xs={20}>
            {getFieldDecorator('radio2', {})(
              <RadioGroupA size="large">
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroupA>,
            )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="城市组件"
        >
            {getFieldDecorator('city', {
              initialValue: [],
            })(
              <CityCheckboxGroupA
                size="large"
                options={cityList}
              />,
            )}
        </FormItem>

        <FormItem
          {...formItemNoLableLayout}
        >
          <Button
            type={Object.values(getFieldsError()).filter(e => e).length <= 0 ? 'primary' : 'danger'}
            loading={false}
            disabled={false}
            style={{ marginRight: 8 }}
          >
            保存
          </Button>
          <Button>取消</Button>
        </FormItem>
      </Form>
    );
  }
}

FormPage.defaultProps = {};

FormPage.propTypes = {};

export default FormPage;
```
