import React, { useState, useEffect, useContext } from 'react'
import { Modal, Row, Col } from 'react-materialize'
import { GameContext } from '../../context/gameContext'
import { RoundResultsTable } from './RoundResultsTable'

export const RoundResultsModal = () => {
  const [timer, setTimer] = useState(5)
  const { socket, roomid, yourTurn, gameState } = useContext(GameContext)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0 && yourTurn) {
        socket.emit('nextRound', { roomid, round: gameState.round })
      } else {
        setTimer((seconds) => seconds - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, roomid, socket, yourTurn, gameState.round])

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
