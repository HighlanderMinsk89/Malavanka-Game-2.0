import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

export const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])

  const { userName, location } = useContext(AuthContext)
  const { roomid } = useParams()

  useEffect(() => {
    const socketCopy = socket
    socket.emit('getRoomUsers', roomid)

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

    socket.on('usersRoomUpdate', (users) => setUsers(users))

    return () => {
      socketCopy.removeAllListeners()
    }
  }, [setMessages, setUsers, userName, socket, location, roomid])

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
      <div className='nicks'>
        {users &&
          users.map((user, idx) => {
            return (
              <div className='chip red white-text' key={idx}>
                {user.userName}
              </div>
            )
          })}
      </div>
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
