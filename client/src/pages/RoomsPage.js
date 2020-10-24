import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { RoomCard } from '../components/Room/RoomCard'

export const RoomsPage = () => {
  const { request, loading } = useHttp()
  const [rooms, setRooms] = useState([])

  const fetchRooms = useCallback(async () => {
    try {
      const rooms = await request('/api/room/allrooms', 'get')
      setRooms(rooms)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className='center-align'>Select Room</h1>
      <ul className='rooms-container'>
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </ul>
    </div>
  )
}
