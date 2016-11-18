import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select, message } from 'antd';
import styles from '../app.less';
import { loginStatus, accountStatus } from '../../staticData';
import xFetch from '../../services/xFetch'

const Option = Select.Option;


const gridSpan = {
  wrapperCol: { span: 14 },
  labelCol: { span: 6 },
  className: styles.formItemBox,
};
const ColSpan = 10;

const FormItem = Form.Item;

export default class FilterForm extends Component {
  constructor() {
    super();
    this.state = {
      project_id: undefined,
    }
  }
  changeProjects(value) {
    this.setState({
      project_id: value,
    })
    this.props.form.setFieldsValue({ project_id: value })
  }

  render() {
    const { project_id: pid } = this.state
    const { form, handleFilter, dataSource, filter = {}, handleReset } = this.props;
    const { getFieldProps, resetFields, validateFields, setFieldsValue } = form;
    const filterProjId = pid || filter.project_id
    const onSubmit = () => {
      validateFields((errors, values) => {
        let { loginStatus, status, baseInfo, project_id } = values
        if (loginStatus !== undefined && loginStatus !== null) {
          loginStatus = parseInt(loginStatus, 10);
        }
        if (status !== undefined && status !== null) {
          status = parseInt(status, 10)
        }
        const marking = { loginStatus, status, baseInfo, project_id }
        handleFilter(marking);
      });
    };
    const onReset = () => {
      this.changeProjects(undefined)
      handleReset()
      resetFields()
    }
    return (
       <Form inline>
         <Row type="flex">
           <Col span={ColSpan}>
             <FormItem
               label="uin/昵称/手机"
               {...gridSpan}
             >
               <Input
                 placeholder="请输入"
                 {...getFieldProps('baseInfo')}
               />
             </FormItem>
           </Col>
           <Col span={ColSpan}>
             <FormItem
               id="project"
               label="所属结构组织"
               {...gridSpan}
             >
               <Select
                 showSearch
                 placeholder="请输入"
                 value={filterProjId}
                 optionFilterProp="children"
                 notFoundContent="没有找到该公司"
                 onChange={this.changeProjects.bind(this)}
               >
                 {dataSource.map(item => {
                   const { _id } = item
                   return <Option key={_id}>{item.title}</Option>
                 })}
               </Select>
             </FormItem>
             <FormItem>
               <Input
                 type="hidden"
                 {...getFieldProps('project_id', {
                   initialValue: filterProjId,
                 })}
               />
             </FormItem>
           </Col>
           <Col span={ColSpan}>
             <FormItem
               id="loginStatus"
               label="登录状态"
               {...gridSpan}
             >
               <Select
                 placeholder="请选择"
                 {...getFieldProps('loginStatus')}
               >
                 {loginStatus.map(item =>
                   <Option value={item.value} key={item.value}>{item.text}</Option>
                 )}
               </Select>
             </FormItem>
           </Col>
           <Col span={ColSpan}>
             <FormItem
               label="账号状态"
               {...gridSpan}
             >
               <Select
                 placeholder="请选择"
                 {...getFieldProps('status')}
               >
                 {accountStatus.map(item =>
                   <Option value={item.value} key={item.value}>{item.text}</Option>
                 )}
               </Select>
             </FormItem>
           </Col>
         </Row>
         <Row
           style={{ textAlign: 'right' }}
         >
           <Col span={24}>
             <Button
               type="primary"
               icon="search"
               style={{ marginRight: 10 }}
               onClick={() => onSubmit()}
             >搜索</Button>
             <Button
               onClick={() => onReset()}
             >清除条件</Button>
           </Col>
         </Row>
       </Form>
     )
   }
}


FilterForm.propTypese = {};


