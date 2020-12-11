import React from 'react'
import styled from 'styled-components/macro'
import { SecretWord } from './SecretWord'
import { nameShortener } from '../../../utils'

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

const WhoIsPickingWordMessage = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & p {
    color: ${(props) => props.theme.darkBlue};
    padding: 0 0.5em;
    font-size: 1.2em;
    font-style: italic;
  }
`

export const GameInfo = ({ gameState, yourTurn }) => {
  let activeUserName
  if (gameState.activeUser)
    activeUserName = Object.values(gameState.activeUser)[0].userName

  console.log('activeUserName', activeUserName)
  return (
    <StyledGameInfo>
      {!gameState.isPlaying ? (
        <WaitingForUsers className='blink-me'>
          <p>Waiting for other users...</p>
        </WaitingForUsers>
      ) : (
        <div>
          {gameState.round !== 0 ? (
            <RoundInfo>
              <p>Round {gameState?.round}</p>
            </RoundInfo>
          ) : null}

          {gameState.word ? (
            <SecretWord word={gameState.word} yourTurn={yourTurn} />
          ) : !gameState.roundFinished ? (
            <WhoIsPickingWordMessage className='blink-me'>
              <p>
                {`${nameShortener(activeUserName)} выбірае,`}
                <br /> што будзе маляваць...
              </p>
            </WhoIsPickingWordMessage>
          ) : null}
        </div>
      )}
    </StyledGameInfo>
  )
}
