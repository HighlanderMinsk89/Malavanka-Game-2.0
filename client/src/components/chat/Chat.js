import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { GameContext } from '../../context/gameContext'
import { ChatBox } from './ChatBox'
import { ButtonStyled } from '../shared/Button'

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

    socket.on('welcomeMessage', (message) => {
      const editedM = {
        message: `${message}, ${userName}!`,
        userName: 'Malavanka',
      }
      setMessages((prevMess) => [...prevMess, editedM])
    })
    //userJoined
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
    }
  }, [setMessages, userName, socket, location, roomid])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    let input = message
    if (gameState.word && input === gameState.word.word) {
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

  return (
    <div className='chat-container'>
      <ChatBox messages={messages} socketId={socket.id} />

      <div className='chat-form'>
        <input
          disabled={yourTurn && gameState.isPlaying}
          value={message}
          type='text'
          placeholder='Guess a word or send message'
          onChange={handleFormChange}
        />
        <ButtonStyled
          disabled={yourTurn && gameState.isPlaying}
          className='default-shadow'
          onClick={handleSendMessage}
        >
          Send
        </ButtonStyled>
      </div>
    </div>
  )
}
