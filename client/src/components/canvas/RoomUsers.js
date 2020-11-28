import React, { useState, useEffect, useContext, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { GameContext } from '../../context/gameContext'

const RedChip = ({ user }) => {
  return (
    <div className='chip red white-text'>
      {user.userName} + P: {user.points}
    </div>
  )
}
const GreenChip = ({ user }) => {
  return (
    <div className='chip green black-text'>
      {user.userName} + P: {user.points}
    </div>
  )
}

export const RoomUsers = () => {
  const [users, setUsers] = useState([])

  const { socket, gameState } = useContext(GameContext)

  const { roomid } = useParams()

  let yourTurn = false
  if (gameState.activeUser) {
    yourTurn = socket.id === Object.keys(gameState.activeUser)[0]
  }

  useEffect(() => {
    const socketCopy = socket
    socket.emit('getRoomUsers', roomid)
    socket.on('usersRoomUpdate', (users) => setUsers(users))

    return () => {
      socketCopy.removeListener('getRoomUsers')
      socketCopy.removeListener('usersRoomUpdate')
    }
  }, [setUsers, socket, roomid])
  return (
    <div className='nicks'>
      {users &&
        users.map((user, idx) => {
          return (
            <Fragment key={idx}>
              {user.match ? <GreenChip user={user} /> : <RedChip user={user} />}
            </Fragment>
          )
        })}
    </div>
  )
}
