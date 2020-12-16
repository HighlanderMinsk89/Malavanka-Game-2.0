import React, { useState, useEffect, useContext } from 'react'
import { Modal, Row, Col } from 'react-materialize'
import { GameContext } from '../../context/gameContext'
import { GameResultsTable } from './GameResultsTable'

export const GameResultsModal = () => {
  const { socket, gameState } = useContext(GameContext)
  const [timer, setTimer] = useState(gameState.gameResultsTimer)

  useEffect(() => {
    socket.on('gameResultsTimer', (seconds) => {
      setTimer(seconds)
    })

    return () => socket.removeAllListeners('gameResultsTimer')
  }, [socket])

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
          <h4>New Game Starts in {timer}...</h4>
        </Col>
      </Row>
    </Modal>
  )
}
