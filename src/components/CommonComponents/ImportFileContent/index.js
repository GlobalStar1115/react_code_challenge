import React, { useEffect, useRef } from 'react'

const ImportFileContent = (props) => {
  let fileReader

  const { loadData, showFileUpload, hideFileUpload } = props
  const fileUpload = useRef()

  const handleFileRead = (e, fileName) => {
    e.preventDefault()
    const content = fileReader.result
    loadData(content, fileName)
  }

  const handleFileChosen = (file) => {
    if (!file || file.type !== 'application/vnd.ms-excel') {
      return
    }
    fileReader = new FileReader()
    fileReader.onloadend = e => handleFileRead(e, file.name)
    fileReader.readAsText(file)
  }

  useEffect(() => {
    showFileUpload && fileUpload.current.click()
    showFileUpload && hideFileUpload()
    // eslint-disable-next-line
  }, [showFileUpload])

  return (
    <div className='upload-component'>
      <input
        type='file'
        id='file'
        className='input-file'
        accept='.csv'
        ref={fileUpload}
        onChange={e => handleFileChosen(e.target.files[0])}
      />
    </div>
  )
}
export default ImportFileContent