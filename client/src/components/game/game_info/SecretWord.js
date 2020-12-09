import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

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

export const SecretWord = ({ word, yourTurn }) => {
  word = !yourTurn ? word.word.replace(/./gi, '_') : word.word
  return (
    <StyledSecretWord>
      <p>{word}</p>
    </StyledSecretWord>
  )
}
