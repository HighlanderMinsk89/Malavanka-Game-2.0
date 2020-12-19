import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { RoomCard } from '../components/Room/RoomCard'
import { SocketContext } from '../context/socketContext'
import styled from 'styled-components/macro'

const StyledRoomsPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const RoomsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

export const RoomsPage = () => {
  const { request, loading } = useHttp()
  const [rooms, setRooms] = useState([])
  const [gameRooms, setGameRooms] = useState({})
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
    setGameRooms(rooms)
  }

  useEffect(() => {
    socket.on('allRoomsQtyUpdate', setCapacityCB)
    socket.emit('getRoomCapacity')

    const socketCopy = socket

    return () => {
      socketCopy.removeAllListeners()
    }
  }, [socket])

  if (loading) {
    return <Loader />
  }

  return (
    <StyledRoomsPage>
      <h4>Калі ласка, абярыце пакой</h4>
      <RoomsContainer>
        {rooms?.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            capacity={gameRooms[room._id]?.users.length || 0}
          />
        ))}
      </RoomsContainer>
    </StyledRoomsPage>
  )
}
