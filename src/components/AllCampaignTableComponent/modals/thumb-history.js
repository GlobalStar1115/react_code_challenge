import React from 'react'
import { Modal } from 'rsuite'
import AreaRechartComponent from '../../CommonComponents/AreaChart'

const CampaignThumbHistory = ({ campaign, metric, areaData, show, direct, onClose, startDate, endDate }) => {
  return (
    <Modal
      backdrop={true}
      className="thumb-history-modal"
      show={show}
      size="lg"
      onClick={onClose}
      onHide={onClose}
    >
      <Modal.Header>
        <Modal.Title>
          {`Campaign: ${campaign}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="metric">
          {`Metric: ${metric}`}
        </div>
        <AreaRechartComponent
          showXAxis
          showYAxis
          showToolTip
          areaData={areaData}
          direct={direct}
          margin={{
            top: 10,
            right: 50,
          }}
          startDate={startDate}
          endDate={endDate}
        />
      </Modal.Body>
    </Modal>
  )
}
export default CampaignThumbHistory