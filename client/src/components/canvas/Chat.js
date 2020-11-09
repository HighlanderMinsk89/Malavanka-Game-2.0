import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

export const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { userName, location } = useContext(AuthContext)
  const { roomid } = useParams()

  useEffect(() => {
    const socketCopy = socket

    socket.on('welcomeMessage', (message) => {
      const editedM = { message: `${message}, ${userName}!` }
      setMessages((prevMess) => [...prevMess, editedM])
    })
    //userJoined
    socket.on('userJoinedMessage', (message) => {
      setMessages((prevMess) => [...prevMess, { message }])
    })

    socket.on('message', (message) => {
      setMessages((prevMess) => [...prevMess, message])
    })

    return () => {
      socketCopy.removeAllListeners()
    }
  }, [setMessages, userName, socket, location, roomid])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    const body = {
      message,
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
          return <h6 key={index}>{body.message}</h6>
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
