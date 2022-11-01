/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useDispatch } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import { hideTableFilterAction } from '../../redux/actions/pageGlobal'

const EditTableFilterLayout = ({ children, applyFilter, resetFilter }) => {
  const dispatch = useDispatch()

  const onCloseColumnEditor = () => {
    dispatch(hideTableFilterAction())
  }

  const onApplyFilter = () => {
    applyFilter()
  }
  const onResetFilter = () => {
    resetFilter()
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        dispatch(hideTableFilterAction())
      }}
    >
      <div className="edit-table-filter-layout">
        <div className="pane-header">
          <div className="pane-title">Table Filters</div>
          <CloseSvg className="close-button" onClick={onCloseColumnEditor} />
        </div>
        <div className="edit-table-filter-body">
          { children }
        </div>
        <div className="edit-table-filter-footer">
          <button type="button" className="btn btn-white" onClick={onResetFilter}>Reset</button>
          <button type="button" className="btn btn-blue" onClick={onApplyFilter}>Apply</button>
        </div>
      </div>
    </OutsideClickHandler>
  );
}

export default EditTableFilterLayout
