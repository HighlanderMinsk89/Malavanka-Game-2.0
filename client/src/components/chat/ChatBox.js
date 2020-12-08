import React from 'react'
import styled, { css } from 'styled-components'
import { nameShortener } from '../../utils'

const StyledChatBox = styled.div`
  background-color: ${(props) => props.theme.white};
  padding-right: 0.2rem;
  flex-grow: 1;
  box-shadow: ${(props) => props.theme.bigShadow};
`

const ChatMessageWrapper = styled.div`
  margin: 0.3rem 0.3rem;
  box-shadow: ${(props) => props.theme.shadow};
  border-radius: 3px;
  width: fit-content;
`

const StyledChatMessage = styled.div`
  display: flex;
  padding: 0.2em 0.1em;
  color: ${(props) => props.theme.white};
  background-color: ${(props) =>
    props.correct ? props.theme.green : props.theme.darkBlue};
  & p {
    margin: 0;
    margin-left: 0.5em;
  }

  & p em {
    font-weight: bolder;
    font-style: italic;
    color: ${(props) =>
      props.correct ? props.theme.white : props.theme.brightRed};
  }
`

const ChatMessage = ({ userName, message, correct }) => {
  return (
    <StyledChatMessage correct={correct}>
      <p>
        <em>{userName}:</em> {message}
      </p>
    </StyledChatMessage>
  )
}

export const ChatBox = ({ messages }) => {
  return (
    <StyledChatBox>
      {messages &&
        messages.map((body, idx) => {
          return (
            <ChatMessageWrapper key={idx}>
              <ChatMessage
                correct={body.correct}
                userName={nameShortener(body.userName)}
                message={body.message}
              />
            </ChatMessageWrapper>
          )
        })}
    </StyledChatBox>
  )
}
