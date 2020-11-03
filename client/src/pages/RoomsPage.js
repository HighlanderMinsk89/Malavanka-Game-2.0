import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { RoomCard } from '../components/Room/RoomCard'
import { useSocketIO } from '../hooks/useSocketIO'

export const RoomsPage = () => {
  const { request, loading } = useHttp()
  const [rooms, setRooms] = useState([])
  const [roomsCapacity, setRoomsCapacity] = useState({})
  const { socketRef } = useSocketIO()

  const fetchRooms = useCallback(async () => {
    try {
      const rooms = await request('/api/room/allrooms', 'get')
      setRooms(rooms)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const setCapacityCB = rooms => {
    setRoomsCapacity(rooms)
  }

  useEffect(() => {
    socketRef.current.on('roomsCapacity', setCapacityCB)
    socketRef.current.emit('getRoomCapacity')
    const interval = setInterval(() => {
      socketRef.current.emit('getRoomCapacity')
    }, 10000)

    const socketRefCopy = socketRef.current

    return () => {
      clearInterval(interval)
      socketRefCopy.off('roomsCapacity', setCapacityCB)
    }
  }, [socketRef])

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
            capacity={roomsCapacity[room._id] || 0}
          />
        ))}
      </ul>
    </div>
  )
}
