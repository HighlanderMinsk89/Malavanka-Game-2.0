import React, { useContext, useEffect } from 'react'

import { AuthContext } from '../context/authContext'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/socketContext'
import { GameMain } from '../components/game/GameMain'

export const RoomPage = () => {
  const { socket } = useContext(SocketContext)
  const { userName, location } = useContext(AuthContext)
  const { roomid } = useParams()

  const newUserInRoom = {
    userName,
    location,
    roomid,
    socketId: socket.id,
  }

  useEffect(() => {
    socket.emit('userJoined', newUserInRoom)
  }, [socket, newUserInRoom])

  useEffect(() => {
    const socketCopy = socket
    return () => {
      socketCopy.emit('leftRoom', { roomid })
    }
  })

  return <GameMain socket={socket} roomid={roomid} />
}
