import React from 'react';

import { Button, Checkbox, Col, Form, Input, Radio, Row } from 'antd';
import reactFormFieldDebounce from '../src/index';
import CityCheckboxGroup from './city-checkbox-group';
import cityList from './city-list';

const InputA = reactFormFieldDebounce(150)(Input);
const FormItem = Form.Item;
const RadioGroupA = reactFormFieldDebounce(250)(Radio.Group);
const CheckboxGroupA = reactFormFieldDebounce(250)(Checkbox.Group);
const CityCheckboxGroupA = reactFormFieldDebounce(250)(CityCheckboxGroup);


const theFormData = {
  city: [],
};


@Form.create({})
class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      formData: theFormData,
    };
  }

  onChange = (e) => {
    console.log(e);
    this.setState({ checked: e });
  }


  formLayout = {
    formItemBaseLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemInputLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemUploadLayout: { labelCol: { xs: 4 }, wrapperCol: { xs: 20 } },
    formItemNoLableLayout: { labelCol: { xs: 0 }, wrapperCol: { xs: { span: 20, offset: 4 } } },
  }

  render() {
    const {
      formItemBaseLayout,
      formItemInputLayout,
      formItemNoLableLayout,
    } = this.formLayout;
    const { formData } = this.state;
    const { getFieldsError, getFieldDecorator } = this.props.form;

    return (
      <Form layout="horizontal">

        <FormItem
          {...formItemInputLayout}
          label="输入框"
        >
          <Col xs={20} sm={10} md={8} lg={6}>
            {getFieldDecorator('input1', {})(
              <InputA />,
            )}
          </Col>
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
          label="城市"
        >
          <Col xs={20}>
            {getFieldDecorator('city', {
              initialValue: [],
            })(
              <CityCheckboxGroupA
                size="large"
                options={cityList}
              />,
            )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemNoLableLayout}
        >
          <div className="submit-btn">
            <Button
              type={Object.values(getFieldsError()).filter(e => e).length <= 0 ? 'primary' : 'danger'}
              loading={false}
              disabled={false}
              onClick={this.handleSubmit}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Button>取消</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

FormPage.defaultProps = {};

FormPage.propTypes = {};

export default FormPage;

