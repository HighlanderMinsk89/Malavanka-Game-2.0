import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components/macro'

import { GameContext } from '../../context/gameContext'
import { RoundResultsTable } from './RoundResultsTable'

export const ResultsModalWrapper = styled.div`
  position: fixed;
  background-color: rgba(1, 5, 43, 0.8);
  z-index: 1;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
`

export const ResultsModal = styled.div`
  position: absolute;
  min-width: 320px;
  width: 50vw;
  max-width: 800px;
  background-color: ${(props) => props.theme.white};
  box-shadow: ${(props) => props.theme.bigShadow};
  top: 15%;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const ResultsInfoAndTimer = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? 'space-between' : 'center'};
  width: 100%;

  & h5 {
    margin: 0;
    padding: 0.2em;
    color: ${(props) => props.theme.darkBlue};
  }
`

export const StyledRoundResultsTable = styled.div`
  min-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em 0;
  height: auto;
  padding: 1em 1em;
  max-height: 50vh;
  overflow-y: auto;
`

export const RoundResultsModal = () => {
  const { socket, gameState } = useContext(GameContext)
  const [timer, setTimer] = useState(gameState.roundResultsTimer)
  const roundName =
    gameState && gameState.round === 1
      ? 'першага'
      : gameState.round === 2
      ? 'другога'
      : 'трэцяга'

  useEffect(() => {
    socket.on('roundResultsTimer', (seconds) => {
      setTimer(seconds)
    })

    return () => socket.removeAllListeners('roundResultsTimer')
  }, [socket])

  return (
    <ResultsModalWrapper>
      <ResultsModal>
        <ResultsInfoAndTimer justifyContent={true}>
          <h5>{`Вынікі ${roundName} тура:`}</h5>
          <h5>{timer}</h5>
        </ResultsInfoAndTimer>
        <StyledRoundResultsTable>
          <RoundResultsTable
            gameState={gameState}
            socket={socket}
          ></RoundResultsTable>
        </StyledRoundResultsTable>
      </ResultsModal>
    </ResultsModalWrapper>
  )
}
