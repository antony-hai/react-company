import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';

export const EDITOR_CANCEL = 'EDITOR_CANCEL';
export const EDITOR_OPEN = 'EDITOR_OPEN';
export const EDITOR_SWITCH = 'EDITOR_SWITCH';

const EditorModal = ({ width, editor, children, handleOk, dispatch, handleClose = () => {} }) => {
  let { title, visible } = editor;

  const handleCancel = () => {
    handleClose();
    dispatch({
      type: EDITOR_CANCEL,
    });
  };

  return (
    <Modal
      title={title}
      visible={visible}
      width={width}
      onCancel={handleCancel.bind(this)}
      onOk={handleOk.bind(this)}
      footer={false}
    >
      <div>
       {children}
      </div>
    </Modal>
  )
};

EditorModal.propTypes = {
  width: PropTypes.number,
  editor: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  handleOk: PropTypes.func,
};

EditorModal.defaultProps = {
  width: 500,
  editor: { visible: false },
  handleOk: () => { console.log('click ok'); },
};

const mapStateToProps = (state) => {
  return {
    editor: state.hasOwnProperty('editor') ?
      state.editor : { title: '编辑', visible: false, data: {} },
  };
};

export default connect(mapStateToProps)(EditorModal);
