import React from 'react'
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
  flex-basis: 40%;
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

export const WhoIsPickingWordMessage = styled.div`
  position: absolute;
  height: 2em;
  width: fit-content;
  background-color: ${(props) => props.theme.darkBlue};
  left: 2%;
  top: 2%;
  z-index: 100;
  box-shadow: ${(props) => props.theme.shadow};

  & p {
    color: ${(props) => props.theme.white};
    padding: 0.2em 0.8em;
    margin: 0;
    font-size: 1.2em;
    font-style: italic;
  }
`

export const GameInfo = ({ gameState, yourTurn }) => {
  return (
    <StyledGameInfo>
      {!gameState.isPlaying ? (
        <WaitingForUsers className='blink-me'>
          <p>Чакаем, каб хтосьці далучыўся...</p>
        </WaitingForUsers>
      ) : (
        <div style={{ position: 'relative' }}>
          {gameState.round !== 0 ? (
            <RoundInfo>
              <p>Раунд {gameState?.round}</p>
            </RoundInfo>
          ) : null}

          {gameState.word ? (
            <SecretWord word={gameState.word} yourTurn={yourTurn} />
          ) : null}
        </div>
      )}
    </StyledGameInfo>
  )
}
