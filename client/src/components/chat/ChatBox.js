import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { nameShortener } from '../../utils'

const StyledChatBox = styled.div`
  background-color: ${(props) => props.theme.white};
  padding-right: 0.2rem;
  flex-grow: 1;
  box-shadow: ${(props) => props.theme.bigShadow};
  overflow: auto;
  display: flex;
  flex-direction: column;
`

const ChatMessageWrapper = styled.div`
  margin: 0.3rem 0.3rem;
  border-radius: 3px;
  width: auto;
  display: flex;
  justify-content: ${(props) =>
    props.yourMessage ? 'flex-end' : 'flex-start'};
`

const StyledChatMessage = styled.div`
  box-shadow: ${(props) => props.theme.shadow};
  display: flex;
  padding: 0.2em 0.1em;
  color: ${(props) => props.theme.white};
  background-color: ${(props) =>
    props.correct ? props.theme.green : props.theme.darkBlue};

  width: fit-content;
  & p {
    margin: 0;
    margin-left: 0.5em;
  }

  & p em {
    color: ${(props) =>
      props.correct ? props.theme.white : props.theme.brightRed};
  }
`

const ChatMessage = ({ userName, message, correct, yourMessage }) => {
  return (
    <StyledChatMessage correct={correct}>
      {correct ? (
        <p>{`${yourMessage ? 'YOU' : userName} GUESSED THE WORD!`}</p>
      ) : (
        <p>
          <em>{userName}: </em>
          {message}
        </p>
      )}
    </StyledChatMessage>
  )
}

export const ChatBox = ({ messages, socketId }) => {
  const messageEndRef = useRef(null)

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <StyledChatBox>
      {messages &&
        messages.map((body, idx) => {
          const yourMessage = socketId === body.socketId
          return (
            <ChatMessageWrapper key={idx} yourMessage={yourMessage}>
              <ChatMessage
                correct={body.correct}
                userName={nameShortener(body.userName)}
                message={body.message}
                yourMessage={yourMessage}
              />
            </ChatMessageWrapper>
          )
        })}
      <div ref={messageEndRef}></div>
    </StyledChatBox>
  )
}
