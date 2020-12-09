import React, { useState, useEffect, useContext, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { GameContext } from '../../context/gameContext'
import styled from 'styled-components'
import { nameShortener } from '../../utils'

const NicksChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  min-height: 2rem;
`

const NickChipCont = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.chipColor ? props.theme.green : props.theme.red};
  color: ${(props) => props.theme.darkBlue};
  border-radius: 3px;
  height: 2rem;
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
`

const NickChipName = styled.p`
  font-size: 14px;
  font-weight: bolder;
  padding: 0 0.5rem;
  margin: 0;
`

const NickChipPoints = styled(NickChipName)`
  background-color: ${(props) => props.theme.darkBlue};
  border-radius: 0 3px 3px 0;
  color: ${(props) => props.theme.white};
  font-size: 14px;
  line-height: 2rem;
`

const BrushActive = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.darkBlue};
  border-radius: 3px 0 0 3px;

  & i {
    color: limegreen;
    padding: 0.1rem 0.1rem 0 0.1rem;
  }
`

export const RoomUsers = () => {
  const [users, setUsers] = useState([])

  const { socket, gameState } = useContext(GameContext)

  const { roomid } = useParams()

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
    <NicksChips>
      {users &&
        users.map((user, idx) => {
          return (
            <NickChipCont
              className='default-shadow'
              key={idx}
              chipColor={user.match}
            >
              {user.isTurnToDraw && gameState.isPlaying ? (
                <BrushActive>
                  <i className='material-icons blink-me'>brush</i>
                </BrushActive>
              ) : null}
              <NickChipName>{nameShortener(user.userName)}</NickChipName>
              {gameState.isPlaying ? (
                <NickChipPoints>{user.points}</NickChipPoints>
              ) : null}
            </NickChipCont>
          )
        })}
    </NicksChips>
  )
}
