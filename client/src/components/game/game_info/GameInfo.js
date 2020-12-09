import React, { Fragment } from 'react'
import styled from 'styled-components/macro'
import { SecretWord } from './SecretWord'

const StyledGameInfo = styled.div`
  display: flex;
  justify-content: center;
  height: 4em;

  & div {
    width: 100%;
    display: flex;
    align-items: center;
  }
`

const WaitingForUsers = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & p {
    font-style: italic;
    font-size: 20px;
    font-weight: 400;
    color: ${(props) => props.theme.darkBlue};
  }
`

const RoundInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 30%;
  & p {
    border-radius: 3px;
    padding: 0 1em;
    background-color: ${({ theme }) => theme.darkBlue};
    box-shadow: ${(props) => props.theme.bigShadow};
    color: ${({ theme }) => theme.white};
    font-style: italic;
    font-size: 20px;
    font-weight: 400;
  }
`

export const GameInfo = ({ gameState, yourTurn }) => {
  return (
    <StyledGameInfo>
      {!gameState.isPlaying ? (
        <WaitingForUsers className='blink-me'>
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
