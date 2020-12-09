import React, { useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { GameContext } from '../../../context/gameContext'

const blinkWord = keyframes`
  50% {
    opacity: 0.5;
  }
`

const StyledSecretWord = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 70%;
  height: 100%;

  & p {
    background-color: ${(props) => props.theme.darkBlue};
    letter-spacing: 1.5rem;
    border-radius: 3px;
    padding-left: 1.5rem;
    box-shadow: ${(props) => props.theme.bigShadow};
    color: ${({ theme }) => theme.brightRed};
    font-size: 26px;
    font-weight: 600;
    text-align: center;
    margin: 0;
    animation: ${blinkWord} 1s linear 3;
  }
`

export const SecretWord = ({ yourTurn }) => {
  const { gameState } = useContext(GameContext)
  const { wordToShow } = gameState
  const word = gameState.word?.word
  console.log('word', word)
  console.log('wordToShow', wordToShow)

  const [wordToDisplay, setWordToDisplay] = useState('')

  useEffect(() => {
    if (yourTurn) {
      setWordToDisplay(word)
    } else {
      setWordToDisplay(wordToShow)
    }
  }, [gameState, yourTurn])

  return (
    <StyledSecretWord>
      <p>{wordToDisplay}</p>
    </StyledSecretWord>
  )
}
