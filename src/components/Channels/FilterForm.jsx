import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import styles from '../app.less';
import { channelStatus } from '../../staticData';

const Option = Select.Option;

const gridSpan = {
  wrapperCol: { span: 14 },
  labelCol: { span: 6 },
  className: styles.formItemBox,
};
const ColSpan = 10;

const FormItem = Form.Item;

const FilterForm = ({ form, handleFilter }) => {
  const { getFieldProps, resetFields, validateFields } = form;

  const onSubmit = () => {
    validateFields((errors, values) => {
      handleFilter(values);
    });
  };
  return (
    <Form inline>
      <Row type="flex">
        <Col span={ColSpan}>
          <FormItem
            label="公司名"
            {...gridSpan}
          >
            <Input
              placeholder="请输入"
              {...getFieldProps('name')}
            />
          </FormItem>
        </Col>
        <Col span={ColSpan}>
          <FormItem
            label="登录状态"
            {...gridSpan}
          >
            <Select
              placeholder="请选择"
              {...getFieldProps('status')}
            >
              {channelStatus.map((value, index) =>
                <Option value={value} key={value}>{value}</Option>
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
            onClick={() => resetFields()}
          >清除条件</Button>
        </Col>
      </Row>
    </Form>
  )
};

FilterForm.propTypese = {};

export default FilterForm;
