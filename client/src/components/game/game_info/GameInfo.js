import React, { Fragment } from 'react'
import styled from 'styled-components'
import { SecretWord } from './SecretWord'

const StyledGameInfo = styled.div`
  display: flex;
  justify-content: space-around;

  & div {
    display: flex;
    justify-content: space-around;
  }
`

const WaitingForUsers = styled.div``

const RoundInfo = styled.div``

export const GameInfo = ({ gameState, yourTurn }) => {
  return (
    <StyledGameInfo>
      {!gameState.isPlaying ? (
        <WaitingForUsers>
          <p>Waiting for other users...</p>
        </WaitingForUsers>
      ) : (
        <div>
          <RoundInfo>
            <p>Round {gameState?.round}</p>
          </RoundInfo>
          {gameState.word ? (
            <SecretWord word={gameState.word} yourTurn={yourTurn} />
          ) : null}
        </div>
      )}
    </StyledGameInfo>
  )
}
