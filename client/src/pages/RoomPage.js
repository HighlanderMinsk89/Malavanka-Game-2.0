import React, { useContext, useEffect } from 'react'
import { CanvasMain } from '../components/canvas/CanvasMain'
import { Chat } from '../components/canvas/Chat'
import { AuthContext } from '../context/authContext'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/socketContext'

export const RoomPage = () => {
  const { socket } = useContext(SocketContext)
  const { userName, location } = useContext(AuthContext)
  const { roomid } = useParams()

  useEffect(() => {
    socket.emit('userJoined', {
      userName,
      location,
      roomid,
      socketId: socket.id,
    })
  }, [socket, userName, location, roomid])

  useEffect(() => {
    const socketCopy = socket
    return () => {
      socketCopy.emit('leftRoom', { roomid })
    }
  })

  return (
    <div>
      <h1>Game Page</h1>
      <div className='room-cont'>
        <CanvasMain socket={socket} />
        <Chat socket={socket} />
      </div>
    </div>
  )
}
