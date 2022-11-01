import React from 'react'
import { useDispatch, useStore } from 'react-redux'

import ControlComponent from '../../components/Controls'
import RelationComponent from '../../components/Relations'
import DrawerComponent from '../../components/Drawer'
import ConnectorsComponent from '../../components/Connectors'
import Zoom from '../../components/Zoom'
import TableEditorComponent from '../../components/TableEditor'
import TablePopup from '../../components/TablePopup'
import RelationPopup from '../../components/RelationPopup'

//    transform: translate(5000px, 5000px) scale(3);
const EditorPage = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const { editor } = store.getState()
  const { zoom, showTableEditor, tblEditorExpanded } = editor

  const styles = 'translate(' + ((zoom-1)*2500) + 'px, ' + ((zoom-1)*2500) + 'px) scale(' + zoom + ')'
  const leftClass = (showTableEditor ? 'editor-layout--left show' : 'editor-layout--left') + (tblEditorExpanded ? ' expanded' : '')

  return (
    <div className="page-editor">
      <div id="drawer-container" className="editor-layout--right">
        <ControlComponent />
        <div id="drawer-zoom-container" style={{transform: styles}}>
          <DrawerComponent />
        </div>
        <Zoom />
        {/* showTableEditor &&
          <TableEditModal />
        */}
      </div>
      <div className={leftClass}>
        <TableEditorComponent />
      </div>
      <TablePopup />
      <RelationPopup />
      <ConnectorsComponent />
    </div>
  );
}

export default EditorPage
