import React, { Component, PropTypes } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'react-redux';
import styles from './app.less';

class FilterBox extends Component {
  componentWillMount() {
    this.props.dispatch(this.props.createFilter())
  }
  render() {
    const myChildren = React.Children.map(this.props.children, (o, i) => {
      return React.cloneElement(o, { form: this.props.form });
    });
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.formBox}>
        <Col span={24}>
         {myChildren}
        </Col>
      </Row>
    )
  }
}

FilterBox.propTypes = {
  filter: PropTypes.object,
  formComponent: PropTypes.any,
  createFilter: PropTypes.func,
};

function onFieldsChange(props, fields) {
  const { dispatch } = props;
  dispatch({
    type: 'filter/change',
    payload: fields,
  })
}

function mapPropsToFields(props) {
  const { filter, cardGroup } = props

  const merge = (data, parentKey) => {
    const filterKeys = Object.keys(data)
    let fields = {}

    if (filterKeys.length) {
      fields = filterKeys.reduce((result, key) => {
        const value = data[key]
        const keys = !parentKey ? key : `${parentKey}.${key}`

        if (typeof value === 'object' && !Array.isArray(value)) {
          const childs = merge(value, keys)
          return Object.assign({}, result, childs)
        }

        return Object.assign(result, { [keys]: { value } })
      }, {})
    }

    return fields
  }

  return merge(filter)
}

function mapStateToProps({ filter }) {
  return {
    filter,
  }
}

export const handleCreateFilter = (thisFilter) => {
  return {
    type: 'filter/create',
    payload: thisFilter,
  }
};

export function handleSubmitFilter(filter) {
  return {
    type: 'filter/submit',
    payload: filter,
  }
}

export default connect(mapStateToProps)(
  Form.create({
    mapPropsToFields,
  })(FilterBox)
)
