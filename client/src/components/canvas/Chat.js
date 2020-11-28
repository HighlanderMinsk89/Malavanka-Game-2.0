import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { GameContext } from '../../context/gameContext'

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
      input = 'MATCH'
      socket.emit('wordMatch', { roomid, socketId: socket.id })
    }
    const body = {
      message: input,
      location,
      roomid,
      userName,
    }
    socket.emit('send message', body)

    setMessage('')
  }

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        {messages.map((body, index) => {
          return (
            <div className='message' key={index}>
              <p>{`${body.userName}: `}</p>
              <p>{body.message}</p>
            </div>
          )
        })}
      </div>
      <div className='chat-form'>
        <input
          disabled={yourTurn && gameState.isPlaying}
          value={message}
          type='text'
          placeholder='Say something'
          onChange={handleFormChange}
        />
        <button
          disabled={yourTurn && gameState.isPlaying}
          className='btn is-success'
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}
