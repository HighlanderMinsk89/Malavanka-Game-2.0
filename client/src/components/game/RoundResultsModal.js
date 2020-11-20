import React, { useState, useEffect } from 'react'
import { Modal, Row, Col } from 'react-materialize'

export const RoundResultsModal = ({ socket, roomid, yourTurn }) => {
  const [timer, setTimer] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0 && yourTurn) {
        socket.emit('nextRound', roomid)
      } else {
        setTimer((seconds) => seconds - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, roomid, socket, yourTurn])

  return (
    <Modal
      className={'modal'}
      header='ROUND RESULTS'
      id='modal1'
      open={true}
      actions={[]}
      options={{
        dismissible: false,
        inDuration: 500,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%',
      }}
    >
      <Row>
        <h4>{timer}</h4>
        <Col m={4} s={12}>
          <p>Results</p>
        </Col>
      </Row>
    </Modal>
  )
}
