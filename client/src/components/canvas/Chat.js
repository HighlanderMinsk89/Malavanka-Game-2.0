import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useSocketIO } from '../../hooks/useSocketIO'

export const Chat = () => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const { socketRef, yourId } = useSocketIO()

  const { userName, userId, location } = useContext(AuthContext)
  const { roomid } = useParams()

  useEffect(() => {
    const socketRefCopy = socketRef.current
    socketRef.current.on('welcomeMessage', (message) => {
      const editedM = { message: `${message}, ${userName}!` }
      setMessages((prevMess) => [...prevMess, editedM])
    })
    //userJoined
    socketRef.current.emit('userJoined', { userName, location, roomid })
    socketRef.current.on('userJoinedMessage', (message) => {
      setMessages((prevMess) => [...prevMess, { message }])
    })

    socketRef.current.on('message', (message) => {
      setMessages((prevMess) => [...prevMess, message])
    })

    return () => {
      socketRefCopy.removeAllListeners()
    }
  }, [setMessages, userName, socketRef, location, roomid])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    const body = {
      message,
      id: yourId,
      location,
      roomid,
      userName,
    }
    socketRef.current.emit('send message', body)
    setMessage('')
  }

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        {messages.map((body, index) => {
          return (
            <h6 key={index}>
              {body.message} <span>{body.id}</span>
            </h6>
          )
        })}
      </div>
      <div className='chat-form'>
        <input
          value={message}
          type='text'
          placeholder='Say something'
          onChange={handleFormChange}
        />
        <button className='btn is-success' onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}
