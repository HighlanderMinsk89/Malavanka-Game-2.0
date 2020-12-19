import React, { useState, useEffect, useContext } from 'react'
import { GameContext } from '../../../context/gameContext'
import { GameResultsTable } from './GameResultsTable'
import {
  ResultsInfoAndTimer,
  ResultsModal,
  ResultsModalWrapper,
  StyledRoundResultsTable,
} from './RoundResultsModal'

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
    <ResultsModalWrapper>
      <ResultsModal>
        <ResultsInfoAndTimer>
          <h5>Вынікі гульні:</h5>
        </ResultsInfoAndTimer>
        <StyledRoundResultsTable>
          <GameResultsTable gameState={gameState} socket={socket} />
        </StyledRoundResultsTable>
        <ResultsInfoAndTimer>
          <h5>{`Новая гульня пачнецца праз ${timer > 0 ? timer : ''}...`}</h5>
        </ResultsInfoAndTimer>
      </ResultsModal>
    </ResultsModalWrapper>
  )
}
