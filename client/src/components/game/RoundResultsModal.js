import React, { useState, useEffect, useContext } from 'react'
import { Modal, Row, Col } from 'react-materialize'
import { GameContext } from '../../context/gameContext'
import { RoundResultsTable } from './RoundResultsTable'

export const RoundResultsModal = () => {
  const { socket, gameState } = useContext(GameContext)
  const [timer, setTimer] = useState(gameState.roundResultsTimer)

  useEffect(() => {
    socket.on('roundResultsTimer', (seconds) => {
      setTimer(seconds)
    })

    return () => socket.removeAllListeners('roundResultsTimer')
  }, [socket])

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
      <RoundResultsTable gameState={gameState} socket={socket} />
      <Row>
        <Col m={4} s={12}>
          <h4>{timer}</h4>
        </Col>
      </Row>
    </Modal>
  )
}
