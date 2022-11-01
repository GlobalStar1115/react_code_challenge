/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useDispatch } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import { hideColumnEditorAction } from '../../redux/actions/pageGlobal'

const EditTableColumnLayout = ({ children, applyColumnChanges, resetToDefault, count }) => {
  const dispatch = useDispatch()

  const onCloseColumnEditor = () => {
    dispatch(hideColumnEditorAction())
  }
  const onApply = () => {
    applyColumnChanges()
  }
  const onReset = () => {
    resetToDefault()
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        dispatch(hideColumnEditorAction())
      }}
    >
      <div className="edit-table-column-layout">
        <div className="pane-header">
          <div className="pane-title">Table Columns</div>
          <CloseSvg className="close-button" onClick={onCloseColumnEditor} />
        </div>
        <div className="edit-table-column-note">
          <span>{count} columns selected.</span>
          <a href="#" onClick={onReset}>Reset to default</a>
        </div>
        <div className="edit-table-column-body">
          {children}
        </div>
        <div className="edit-table-column-footer">
          <button type="button" className="btn btn-blue" onClick={onApply}>Apply</button>
        </div>
      </div>
    </OutsideClickHandler>
  );
}

export default EditTableColumnLayout
