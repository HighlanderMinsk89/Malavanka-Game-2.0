import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../Loader'

export const TestChat = () => {
  const location = useLocation()
  const { loading, request } = useHttp()
  const [yourId, setYourId] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])

  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io.connect('/')

    socketRef.current.on('your id', (id) => {
      setYourId(id)
      console.log('id set', id)
    })

    socketRef.current.on('message', (message) => {
      setMessages((prevMess) => [...prevMess, message])
    })
  }, [setYourId, setMessages])

  const handleFormChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    const body = {
      message,
      id: yourId,
    }
    socketRef.current.emit('send message', body)
    setMessage('')
  }

  const getListOfUsers = useCallback(
    async (roomId) => {
      try {
        const users = await request(`/api/room/${roomId}`, 'get')
        setUsers(users)
      } catch (e) {}
    },
    [request]
  )

  const { id } = useParams()

  useEffect(() => {
    getListOfUsers(id)
  }, [id, getListOfUsers])

  useEffect(() => {
    console.log('Playing')
    //TO TRY CLEANUP TO DELETE USER
  }, [location])

  if (loading) return <Loader />
  return (
    <div>
      <h1>Chat</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      <div>
        <ul>
          {users.map((user, idx) => {
            return (
              <li key={idx}>
                {user.userName} / {user.location}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
