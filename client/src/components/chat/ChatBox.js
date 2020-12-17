import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components/macro'
import { nameShortener } from '../../utils'

const StyledChatBox = styled.div`
  background-color: ${(props) => props.theme.darkBlue};
  padding-right: 0.2rem;
  flex-grow: 1;
  box-shadow: ${(props) => props.theme.shadow};
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-top: 0.5em;
`

const ChatMessageWrapper = styled.div`
  margin: 0.1rem 0.3rem;
  border-radius: 3px;
  width: auto;
  display: flex;
  justify-content: ${(props) =>
    props.correct || props.reveal
      ? 'center'
      : props.yourMessage
      ? 'flex-end'
      : 'flex-start'};
`

const StyledChatMessage = styled.div`
  /* box-shadow: ${(props) => props.theme.shadow}; */
  display: flex;
  justify-content: center;
  padding: 0.1em 0.2em;
  color: ${(props) => props.theme.darkBlue};
  background-color: ${(props) =>
    props.correct ? props.theme.green : props.theme.white};

  ${(props) =>
    props.userName === 'Маляванка'
      ? css`
          background-color: #ffb703;
          color: ${(props) => props.theme.darkBlue};
        `
      : null}

  width: ${(props) => (props.correct || props.reveal ? '100%' : 'fit-content')};
  & p {
    margin: 0;
    margin-left: 0.5em;
  }

  & p em {
    padding-right: 0.3em;
    color: ${(props) =>
      props.correct && props.userName !== 'Маляванка'
        ? props.theme.white
        : props.theme.brightRed};
  }
`

const ChatMessage = ({ userName, message, correct, yourMessage, reveal }) => {
  return (
    <StyledChatMessage correct={correct} userName={userName} reveal={reveal}>
      {correct ? (
        <p>{`${
          yourMessage ? 'ВЫ АДГАДАЛІ СЛОВА!' : `${userName} АДГАДАЎ(ЛА) СЛОВА!`
        }`}</p>
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
            <ChatMessageWrapper
              key={idx}
              yourMessage={yourMessage}
              correct={body.correct}
              reveal={body.reveal}
            >
              <ChatMessage
                correct={body.correct}
                userName={nameShortener(body.userName)}
                message={body.message}
                yourMessage={yourMessage}
                reveal={body.reveal}
              />
            </ChatMessageWrapper>
          )
        })}
      <div ref={messageEndRef}></div>
    </StyledChatBox>
  )
}
