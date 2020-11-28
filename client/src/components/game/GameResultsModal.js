import React, { useState, useEffect, useContext } from 'react'
import { Modal, Row, Col } from 'react-materialize'
import { GameContext } from '../../context/gameContext'
import { GameResultsTable } from './GameResultsTable'

export const GameResultsModal = () => {
  const [timer, setTimer] = useState(15)
  const { socket, yourTurn, roomid, gameState } = useContext(GameContext)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0 && yourTurn) {
        socket.emit('newGame', roomid)
      } else {
        setTimer((seconds) => seconds - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, roomid, socket, yourTurn])

  return (
    <Modal
      className={'modal'}
      header='GAME RESULTS'
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
      <GameResultsTable gameState={gameState} />
      <Row>
        <Col>
          <h4>New Game Starts in {timer} seconds...</h4>
        </Col>
      </Row>
    </Modal>
  )
}
