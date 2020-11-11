import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { RoomCard } from '../components/Room/RoomCard'
import { SocketContext } from '../context/socketContext'

export const RoomsPage = () => {
  const { request, loading } = useHttp()
  const [rooms, setRooms] = useState([])
  const [roomsCapacity, setRoomsCapacity] = useState({})
  const { socket } = useContext(SocketContext)

  const fetchRooms = useCallback(async () => {
    try {
      const rooms = await request('/api/room/allrooms', 'get')
      setRooms(rooms)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const setCapacityCB = (rooms) => {
    setRoomsCapacity(rooms)
  }

  useEffect(() => {
    socket.on('roomsAndUsers', setCapacityCB)
    socket.emit('getRoomCapacity')
    const interval = setInterval(() => {
      socket.emit('getRoomCapacity')
    }, 3000)

    const socketCopy = socket

    return () => {
      clearInterval(interval)
      socketCopy.removeAllListeners()
    }
  }, [socket])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className='center-align'>Select Room</h1>
      <ul className='rooms-container'>
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            capacity={
              (roomsCapacity[room._id] && roomsCapacity[room._id].length) || 0
            }
          />
        ))}
      </ul>
    </div>
  )
}
