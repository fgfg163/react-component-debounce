import React from 'react';

import { Button, Checkbox, Col, Form, Input, Radio, Row } from 'antd';
import reactFormFieldDebounce from '../src/index';
import CityCheckboxGroup from './city-checkbox-group';

const InputA = reactFormFieldDebounce(150)(Input);
const FormItem = Form.Item;
const RadioGroupA = reactFormFieldDebounce(250)(Radio.Group);
const CheckboxGroupA = reactFormFieldDebounce(250)(Checkbox.Group);
const CityCheckboxGroupA = reactFormFieldDebounce(250)(CityCheckboxGroup);


const formData = {};


@Form.create({})
class FormPage extends React.Component {
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

    const { getFieldsError, getFieldDecorator } = this.props.form;

    return (

      <Form layout="horizontal">
        <FormItem
          {...formItemInputLayout}
          label="邮箱"
        >
          <Col xs={20} sm={10} md={8} lg={6}>
            {formData.base.user_name}
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="账号状态"
        >
          <Col xs={20}>
            {getFieldDecorator('base.user_status', {})(
              <RadioGroupA size="large">
                <Radio value="1">有效</Radio>
                <Radio value="0">无效</Radio>
              </RadioGroupA>,
            )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="登录方式"
        >
          <Col xs={20}>
            {getFieldDecorator('base.uuap_wmpass', {})(
              <RadioGroupA size="large">
                <Radio value="1">wmpass登录</Radio>
                <Radio value="0">uuap登录</Radio>
              </RadioGroupA>,
            )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemInputLayout}
          label="ad-hoc查询数"
        >
          <Col xs={20} sm={10} md={8} lg={6}>
            {getFieldDecorator('adhoc.adhoc_query_times', {})(
              <InputA size="large" />,
            )}
          </Col>
          <Col xs={20} sm={14} md={16} lg={18}>
            (-1表示没权限，0表示不限制查询量,&gt;0则为具体查询量)
          </Col>
        </FormItem>

        <FormItem
          {...formItemInputLayout}
          label="ad-hoc日下载记录数"
        >
          <Col xs={20} sm={10} md={8} lg={6}>
            {getFieldDecorator('adhoc.adhoc_result_set', {})(
              <InputA size="large" />,
            )}
          </Col>
          <Col xs={20} sm={14} md={16} lg={18}>
            (-1表示没权限，0表示不限制查询量,&gt;0则为具体查询量)
          </Col>
        </FormItem>

        <FormItem
          {...formItemInputLayout}
          label="ad-hoc单个sql最大返回记录数"
        >
          <Col xs={20} sm={10} md={8} lg={6}>
            {getFieldDecorator('adhoc.adhoc_max_rows_per_search', {})(
              <InputA size="large" />,
            )}
          </Col>
          <Col xs={20} sm={14} md={16} lg={18}>
            (-1表示没权限，0表示不限制查询量,&gt;0则为具体查询量)
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="基本信息"
        >
          <Col xs={20}>
            <table className="base-info-table">
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>{formData.base.real_name}</td>
                </tr>
                <tr>
                  <td>公司</td>
                  <td>{formData.base.user_company}</td>
                </tr>
                <tr>
                  <td>部门</td>
                  <td>{formData.base.user_department}</td>
                </tr>
                <tr>
                  <td>职位</td>
                  <td>{formData.base.user_post}</td>
                </tr>
                <tr>
                  <td>hi号</td>
                  <td>{formData.base.hiNumber}</td>
                </tr>
                <tr>
                  <td>手机</td>
                  <td>{formData.base.mobileNumber}</td>
                </tr>
                <tr>
                  <td>直属上级</td>
                  <td>{formData.base.superiorName}</td>
                </tr>
                <tr>
                  <td>上级邮箱</td>
                  <td>{formData.base.superiorEmail}</td>
                </tr>
                <tr>
                  <td>部门类型</td>
                  <td>{formData.base.departmentType}</td>
                </tr>
                <tr>
                  <td>工作大厦</td>
                  <td>{formData.base.entryLocation}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </FormItem>

        <FormItem
          {...formItemBaseLayout}
          label="城市"
        >
          <Col xs={20}>
            {getFieldDecorator('city.permission', {
              initialValue: [],
            })(
              <CityCheckboxGroupA
                size="large"
                options={[]}
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

