import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { GameContext } from '../../context/gameContext'
import { ChatBox } from './ChatBox'
import { StyledButton } from '../shared/Button'

export const Chat = () => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { socket, gameState } = useContext(GameContext)

  const { userName, location } = useContext(AuthContext)
  const { roomid } = useParams()

  let yourTurn = false
  if (gameState.activeUser) {
    yourTurn = socket.id === Object.keys(gameState.activeUser)[0]
  }

  useEffect(() => {
    const socketCopy = socket

    socket.on('clearChat', () => {
      if (messages.length >= 50) {
        setMessages([])
      }
    })

    socket.on('welcomeMessage', (message) => {
      const editedM = {
        message: `${message}, ${userName}!`,
        userName: 'Malavanka',
      }
      setMessages((prevMess) => [...prevMess, editedM])
    })

    socket.on('userJoinedMessage', (message) => {
      setMessages((prevMess) => [
        ...prevMess,
        { message, userName: 'Malavanka' },
      ])
    })

    socket.on('message', (message) => {
      setMessages((prevMess) => [...prevMess, message])
    })

    return () => {
      socketCopy.removeListener('welcomeMessage')
      socketCopy.removeListener('userJoinedMessage')
      socketCopy.removeListener('message')
      socketCopy.removeListener('clearChat')
    }
  }, [setMessages, userName, socket, location, roomid, messages])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleEnterPress = (e) => {
    if (e.keyCode === 13) handleSendMessage()
  }

  const handleSendMessage = () => {
    if (message.length) {
      let input = message
      if (gameState.word && input.toUpperCase() === gameState.word.word) {
        input = 'GUESSED THE WORD!'
        socket.emit('wordMatch', { roomid, socketId: socket.id })
      }
      const body = {
        message: input,
        location,
        roomid,
        userName,
        correct: input === 'GUESSED THE WORD!',
        socketId: socket.id,
      }

      socket.emit('send message', body)
      setMessage('')
    }
  }

  return (
    <div className='chat-container'>
      <ChatBox messages={messages} socketId={socket.id} />

      <div className='chat-form'>
        <input
          disabled={yourTurn && gameState.isPlaying}
          value={message}
          type='text'
          placeholder='Адгадваць ды чаціцца тут'
          onChange={handleFormChange}
          onKeyUp={handleEnterPress}
        />
        <StyledButton
          disabled={yourTurn && gameState.isPlaying}
          onPress={handleSendMessage}
        >
          <span>
            {' '}
            <i className='small material-icons'>send</i>
          </span>
        </StyledButton>
      </div>
    </div>
  )
}
