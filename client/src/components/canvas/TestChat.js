import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

export const TestChat = () => {
  const [yourId, setYourId] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io.connect('/')

    socketRef.current.on('your id', (id) => {
      setYourId(id)
      console.log('id set', id)
    })

    socketRef.current.on('message', (message) => {
      setMessages(prevMess => [...prevMess, message])
    })
  }, [setYourId, setMessages])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    const body = {
      message,
      id: yourId
    }
    socketRef.current.emit('send message', body)
    setMessage('')
  }
  return (
    <div>
      <h1>Chat</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='chat-box'>
          {messages.map((body, index) => {
            return (
            <h6 key={index}>{body.message} <span>{body.id}</span></h6>
            )
          })}
        </div>
        <div className='chat-form'>
          <input
            value={message}
            type="text"
            placeholder='Say something'
            onChange={handleFormChange}
          />
          <button className='btn is-success' onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
